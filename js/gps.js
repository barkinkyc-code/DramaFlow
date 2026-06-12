// GPS Manager — stabil, otomatik yeniden bağlanan GPS sistemi
const GPS = {
  watchId: null,
  currentLat: null,
  currentLng: null,
  accuracy: null,
  quality: 'off', // off, bad, ok, good
  activeStopId: null,
  onUpdate: null,
  retryTimer: null,
  lastUpdateTime: null,

  start(stopId, onUpdate) {
    this.activeStopId = stopId;
    this.onUpdate = onUpdate;
    this._watch();
    // Ekran aktif olduğunda yeniden başlat
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') this._ensureRunning();
    });
  },

  stop() {
    if (this.watchId !== null) navigator.geolocation.clearWatch(this.watchId);
    this.watchId = null;
    clearTimeout(this.retryTimer);
    this.quality = 'off';
    this._updateUI();
  },

  _watch() {
    if (!navigator.geolocation) { this.quality = 'off'; this._updateUI(); return; }
    if (this.watchId !== null) navigator.geolocation.clearWatch(this.watchId);
    this.watchId = navigator.geolocation.watchPosition(
      pos => this._onPos(pos),
      err => this._onErr(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
    this.lastUpdateTime = Date.now();
  },

  _onPos(pos) {
    this.currentLat = pos.coords.latitude;
    this.currentLng = pos.coords.longitude;
    this.accuracy = pos.coords.accuracy;
    this.lastUpdateTime = Date.now();

    if (this.accuracy < 20) this.quality = 'good';
    else if (this.accuracy < 60) this.quality = 'ok';
    else this.quality = 'bad';

    this._updateUI();

    if (this.activeStopId) {
      saveGPSLocation(this.activeStopId, this.currentLat, this.currentLng);
    }
    if (this.onUpdate) this.onUpdate(this.currentLat, this.currentLng, this.accuracy);
  },

  _onErr(err) {
    console.warn('GPS error:', err.code, err.message);
    this.quality = 'bad';
    this._updateUI();
    // 5 saniye sonra yeniden dene
    clearTimeout(this.retryTimer);
    this.retryTimer = setTimeout(() => this._watch(), 5000);
  },

  _ensureRunning() {
    const stale = !this.lastUpdateTime || (Date.now() - this.lastUpdateTime > 30000);
    if (stale || this.watchId === null) this._watch();
  },

  _updateUI() {
    const bar = document.getElementById('gps-bar');
    if (!bar) return;
    const labels = { off: 'GPS kapalı', bad: 'GPS zayıf', ok: 'GPS orta', good: 'GPS iyi' };
    const icons = { off: '○', bad: '◑', ok: '◕', good: '●' };
    bar.textContent = '';
    const dot = document.createElement('span');
    dot.textContent = icons[this.quality] + ' ' + labels[this.quality];
    if (this.accuracy) dot.textContent += ' (' + Math.round(this.accuracy) + 'm)';
    bar.appendChild(dot);
    bar.className = 'gps-bar' + (this.quality === 'good' || this.quality === 'ok' ? '' : this.quality === 'bad' ? ' bad' : ' off');
  },

  getCoords() {
    return this.currentLat ? { lat: this.currentLat, lng: this.currentLng } : null;
  }
};

// Periyodik gönderim (10 sn)
let gpsInterval = null;
function startGPSBroadcast(stopId, onUpdate) {
  GPS.start(stopId, onUpdate);
  clearInterval(gpsInterval);
  gpsInterval = setInterval(() => {
    if (GPS.currentLat) {
      saveGPSLocation(stopId, GPS.currentLat, GPS.currentLng);
      if (onUpdate) onUpdate(GPS.currentLat, GPS.currentLng, GPS.accuracy);
    } else {
      GPS._ensureRunning();
    }
  }, APP_CONFIG.gpsInterval);
}

function stopGPSBroadcast() {
  GPS.stop();
  clearInterval(gpsInterval);
}
