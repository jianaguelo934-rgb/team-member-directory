const App = (() => {
  // ── Dark Mode ──
  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.getElementById('theme-opt-light').classList.toggle('active', !dark);
    document.getElementById('theme-opt-dark').classList.toggle('active', dark);
  }

  function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    applyTheme(isDark);

    document.getElementById('theme-toggle').addEventListener('click', () => {
      const nowDark = document.documentElement.getAttribute('data-theme') !== 'dark';
      applyTheme(nowDark);
      localStorage.setItem('theme', nowDark ? 'dark' : 'light');
    });
  }

  function showApp(user) {
    document.getElementById('auth-pages').style.display = 'none';
    document.getElementById('app').classList.add('visible');
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    document.getElementById('nav-avatar').textContent = initials;
    document.getElementById('nav-username').textContent = user.name;
    Members.init();
  }

  function showAuth() {
    document.getElementById('auth-pages').style.display = 'block';
    document.getElementById('app').classList.remove('visible');
  }

  function init() {
    initTheme();
    Auth.init();

    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      showAuth();
    });

    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    if (token && user) {
      api.auth.me().then(() => {
        showApp(JSON.parse(user));
      }).catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        showAuth();
      });
    } else {
      showAuth();
    }
  }

  return { init, showApp };
})();

document.addEventListener('DOMContentLoaded', App.init);
