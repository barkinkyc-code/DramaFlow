// ── SUPABASE CONFIG ──
// Supabase projenizi oluşturduktan sonra bu değerleri güncelleyin:
// https://supabase.com → New Project → Settings → API
const SUPABASE_URL = 'https://lvazlcubqqknpjfhpzzp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2YXpsY3VicXFrbnBqZmhwenpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjMzMTUsImV4cCI6MjA5NjgzOTMxNX0.3_cEUBOyZDpddL2koN-E4eHohR20AR_Q9iRaZnnMz5w';

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Uygulama sabitleri
const APP_CONFIG = {
  plates: ['16 ASE 156', '16 AHN 572'],
  adminUser: 'admin',
  adminPass: 'drama2024',
  drivers: [
    { id: 'd1', username: 'sofor1', password: '1234', name: 'Mehmet K.', plate: '16 ASE 156' },
    { id: 'd2', username: 'sofor2', password: '1234', name: 'Ali R.', plate: '16 AHN 572' },
  ],
  trackingBase: window.location.origin + '/pages/tracking.html',
  notifyEmail: 'barkin.kayaci@dramamakine.com',
  gpsInterval: 10000, // 10 saniye
};

// Seed firmalar
const SEED_COMPANIES = [
  { id: 'c1',  name: 'NSK OTOMOTİV SANAYİ VE TİCARET A.Ş.',            address: 'Nilüfer OSB, Bursa',         lat: 40.2186, lng: 28.9342 },
  { id: 'c2',  name: 'ŞAHİNCE OTOMOTİV SANAYİ VE TİC. A.Ş.',           address: 'Yıldırım, Bursa',             lat: 40.1896, lng: 29.1021 },
  { id: 'c3',  name: 'CANEL OTOMOTİV SAN. VE TİC. A.Ş.',                address: 'Osmangazi, Bursa',            lat: 40.1826, lng: 29.0614 },
  { id: 'c4',  name: 'EJS ESKİŞEHİR JANT VE MAKİNA SAN. TİC. A.Ş.',    address: 'Eskişehir OSB, Eskişehir',    lat: 39.7767, lng: 30.5206 },
  { id: 'c5',  name: 'DERİN HAVACILIK SANAYİ TİCARET A.Ş.',             address: 'Gemlik, Bursa',               lat: 40.4323, lng: 29.1537 },
  { id: 'c6',  name: 'TEKNOFORM MAKİNA İNŞ. SAN. TİC. LTD. ŞTİ.',      address: 'Mustafakemalpaşa, Bursa',     lat: 40.0398, lng: 28.4072 },
  { id: 'c7',  name: 'DEHA OTOMAT MAK. SAN. VE TİC. LTD. ŞTİ.',        address: 'Kestel, Bursa',               lat: 40.1741, lng: 29.2156 },
  { id: 'c8',  name: 'DURMAZLAR MAKİNA SAN. VE TİC. A.Ş.',              address: 'Nilüfer, Bursa',              lat: 40.2344, lng: 28.9821 },
  { id: 'c9',  name: 'FENESE KALIP PLASTİK METAL SAN. TİC. LTD. ŞTİ.', address: 'Gürsu, Bursa',               lat: 40.2012, lng: 29.1834 },
  { id: 'c10', name: 'DOĞU PRES OTOMOTİV VE TEKNİK SAN. VE TİC. A.Ş.', address: 'Osmangazi, Bursa',           lat: 40.1953, lng: 29.0734 },
  { id: 'c11', name: 'HÜNEL KALIP SAN. VE TİC. LTD. ŞTİ.',             address: 'Yıldırım, Bursa',             lat: 40.1812, lng: 29.1243 },
  { id: 'c12', name: 'SYC DEMİR DÖKÜM VE MAKİNA SAN. TİC. A.Ş.',       address: 'İnegöl, Bursa',              lat: 40.0712, lng: 29.5134 },
  { id: 'c13', name: 'YEMTAR MAKİNA SAN. TİC. A.Ş.',                    address: 'Nilüfer OSB, Bursa',          lat: 40.2267, lng: 28.9512 },
];

// LocalStorage helpers (Supabase olmadan çalışır)
const DB = {
  get(key) { try { return JSON.parse(localStorage.getItem('dm_' + key)) || null; } catch { return null; } },
  set(key, val) { localStorage.setItem('dm_' + key, JSON.stringify(val)); },
  del(key) { localStorage.removeItem('dm_' + key); },
};

// Firmalar — Supabase yoksa seed'den yükle
function getCompanies() {
  let c = DB.get('companies');
  if (!c) { DB.set('companies', SEED_COMPANIES); c = SEED_COMPANIES; }
  return c;
}

function getFavorites() { return DB.get('favorites') || []; }
function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) favs = favs.filter(f => f !== id);
  else favs.push(id);
  DB.set('favorites', favs);
  return favs;
}

// Rotalar
function getRoutes() { return DB.get('routes') || []; }
function saveRoute(r) {
  let routes = getRoutes();
  const idx = routes.findIndex(x => x.id === r.id);
  if (idx >= 0) routes[idx] = r; else routes.push(r);
  DB.set('routes', routes);
}
function getActiveRoute(driverId) {
  return getRoutes().find(r => r.driverId === driverId && r.status === 'active') || null;
}

// Token
function generateToken() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Format helpers
function fmt(date) {
  if (!date) return '—';
  const d = new Date(date);
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}
function fmtDate(date) {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR');
}

// Toast
function showToast(msg, duration = 2500) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.style.display = 'none', duration);
}

// ETA via OSRM
async function getETA(fromLat, fromLng, toLat, toLng) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
    const r = await fetch(url);
    const d = await r.json();
    if (d.routes && d.routes[0]) {
      const s = d.routes[0].duration;
      const dist = (d.routes[0].distance / 1000).toFixed(1);
      const mins = Math.round(s / 60);
      const arrive = new Date(Date.now() + s * 1000);
      return { mins, arrive: fmt(arrive), dist, coords: d.routes[0].geometry.coordinates };
    }
  } catch (e) { console.warn('OSRM error', e); }
  return null;
}

// Mail via Claude API (self-contained HTML template)
function buildMailHTML(stop, plate, driverName, eta) {
  const token = stop.trackToken;
  const trackUrl = APP_CONFIG.trackingBase + '?token=' + token;
  const now = fmt(new Date());
  return `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>Siparişiniz Yola Çıktı</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <!-- Header -->
  <tr><td style="background:#0f1c3f;padding:28px 32px;">
    <table width="100%"><tr>
      <td><span style="font-size:20px;font-weight:700;color:white;">Drama Makine</span><br><span style="font-size:13px;color:#93c5fd;">Sevkiyat Takip Sistemi</span></td>
      <td align="right"><span style="background:#22c55e;color:#052e16;padding:6px 14px;border-radius:99px;font-size:13px;font-weight:700;">● Yola Çıktı</span></td>
    </tr></table>
  </td></tr>
  <!-- Hero -->
  <tr><td style="padding:32px 32px 0;">
    <p style="font-size:15px;color:#64748b;margin:0 0 8px;">Sayın Yetkili,</p>
    <h1 style="font-size:24px;font-weight:800;color:#0f172a;margin:0 0 8px;">${stop.companyName}</h1>
    <p style="font-size:14px;color:#64748b;margin:0;">firmanıza ait siparişiniz yola çıkmıştır.</p>
  </td></tr>
  <!-- Info Cards -->
  <tr><td style="padding:24px 32px;">
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td width="48%" style="background:#0f1c3f;border-radius:12px;padding:16px;vertical-align:top;">
          <div style="font-size:11px;color:#93c5fd;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Araç Plakası</div>
          <div style="font-size:20px;font-weight:800;color:white;">${plate}</div>
        </td>
        <td width="4%"></td>
        <td width="48%" style="background:#0f1c3f;border-radius:12px;padding:16px;vertical-align:top;">
          <div style="font-size:11px;color:#93c5fd;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Yola Çıkış</div>
          <div style="font-size:20px;font-weight:800;color:white;">${now}</div>
        </td>
      </tr>
      <tr><td colspan="3" style="padding:8px 0 0;"></td></tr>
      <tr>
        <td width="48%" style="background:#0f1c3f;border-radius:12px;padding:16px;vertical-align:top;">
          <div style="font-size:11px;color:#93c5fd;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Tahmini Varış (ETA)</div>
          <div style="font-size:20px;font-weight:800;color:#fbbf24;">${eta ? eta.arrive + ' (~' + eta.mins + ' dk)' : 'Hesaplanıyor...'}</div>
        </td>
        <td width="4%"></td>
        <td width="48%" style="background:#0f1c3f;border-radius:12px;padding:16px;vertical-align:top;">
          <div style="font-size:11px;color:#93c5fd;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Adres</div>
          <div style="font-size:13px;font-weight:600;color:white;line-height:1.4;">${stop.address}</div>
        </td>
      </tr>
    </table>
  </td></tr>
  <!-- Track Button -->
  <tr><td style="padding:0 32px 32px;" align="center">
    <a href="${trackUrl}" style="display:block;background:#2563eb;color:white;text-decoration:none;padding:16px;border-radius:12px;font-size:16px;font-weight:700;text-align:center;">
      🗺️ Canlı Konumu Takip Et
    </a>
    <p style="font-size:12px;color:#94a3b8;margin-top:12px;">Bu link herkese açıktır — giriş gerekmez.</p>
  </td></tr>
  <!-- Footer -->
  <tr><td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
    <p style="font-size:12px;color:#94a3b8;margin:0;">Drama Makine Sevkiyat Sistemi · Otomatik bildirim · <a href="${trackUrl}" style="color:#2563eb;">Takip linki</a></p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

// Simulated mail send (gerçek backend ile değiştirilecek)
async function sendNotificationMail(stop, plate, driverName, eta) {
  const html = buildMailHTML(stop, plate, driverName, eta);
  console.log('[MAIL] Sending to:', APP_CONFIG.notifyEmail, 'Subject:', stop.companyName + ' — Siparişiniz Yola Çıktı');
  // Gerçek entegrasyon için Supabase Edge Function veya Resend API ekleyin
  // Şimdilik localStorage'a kaydediyoruz
  const mails = DB.get('sent_mails') || [];
  mails.push({ to: APP_CONFIG.notifyEmail, subject: stop.companyName + ' — Siparişiniz Yola Çıktı', html, sent_at: new Date().toISOString(), token: stop.trackToken });
  DB.set('sent_mails', mails);
  return true;
}

// GPS Location store
function saveGPSLocation(stopId, lat, lng) {
  const key = 'gps_' + stopId;
  const locs = DB.get(key) || [];
  locs.push({ lat, lng, ts: Date.now() });
  if (locs.length > 500) locs.splice(0, locs.length - 500);
  DB.set(key, locs);
  // Save latest to quick-access key
  DB.set('last_loc_' + stopId, { lat, lng, ts: Date.now() });
}
function getLastLocation(stopId) { return DB.get('last_loc_' + stopId); }
function getLocationByToken(token) {
  const routes = getRoutes();
  for (const r of routes) {
    const stop = (r.stops || []).find(s => s.trackToken === token);
    if (stop) return { stop, route: r, loc: getLastLocation(stop.id) };
  }
  return null;
}

// Session
function getSession() { return DB.get('session'); }
function setSession(s) { DB.set('session', s); }
function clearSession() { DB.del('session'); }
