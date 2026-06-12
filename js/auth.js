function doLogin() {
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value;
  const err = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');

  if (!user || !pass) { showErr('Kullanıcı adı ve şifre gerekli.'); return; }

  btn.innerHTML = '<div class="spinner"></div>';
  btn.disabled = true;

  setTimeout(() => {
    // Admin kontrolü
    if (user === APP_CONFIG.adminUser && pass === APP_CONFIG.adminPass) {
      setSession({ id: 'admin', username: 'admin', name: 'Admin', role: 'admin', plate: null });
      location.href = 'pages/panel.html';
      return;
    }
    // Şoför kontrolü
    const driver = APP_CONFIG.drivers.find(d => d.username === user && d.password === pass);
    if (driver) {
      setSession({ id: driver.id, username: driver.username, name: driver.name, role: 'driver', plate: driver.plate });
      location.href = 'pages/panel.html';
      return;
    }
    btn.innerHTML = '<span>Giriş Yap</span>';
    btn.disabled = false;
    showErr('Kullanıcı adı veya şifre hatalı.');
  }, 400);

  function showErr(msg) {
    err.textContent = msg;
    err.style.display = 'block';
    btn.innerHTML = '<span>Giriş Yap</span>';
    btn.disabled = false;
  }
}

function requireAuth(role) {
  const s = getSession();
  if (!s) { location.href = '../index.html'; return null; }
  if (role && s.role !== role) { location.href = 'panel.html'; return null; }
  return s;
}

function doLogout() {
  clearSession();
  location.href = '../index.html';
}
