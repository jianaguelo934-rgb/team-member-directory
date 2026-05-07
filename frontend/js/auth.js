const Auth = (() => {
  function showAlert(id, msg, type = 'error') {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.className = `alert alert-${type} show`;
  }
  function hideAlert(id) {
    document.getElementById(id).classList.remove('show');
  }
  function setLoading(btnId, loading, label) {
    const btn = document.getElementById(btnId);
    btn.disabled = loading;
    btn.querySelector('span').textContent = loading ? 'Please wait...' : label;
  }
  function validateField(input, condition) {
    const group = input.closest('.form-group');
    if (!condition) { group.classList.add('has-error'); return false; }
    group.classList.remove('has-error'); return true;
  }

  // ── Show/Hide Password ──
  function initPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        btn.querySelector('svg').innerHTML = isHidden
          ? '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>'
          : '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
      });
    });
  }

  // ── Password Strength ──
  function getStrength(pw) {
    let score = 0;
    if (pw.length >= 6)  score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: 'Weak',   cls: 'weak' };
    if (score === 2) return { level: 2, label: 'Fair',   cls: 'fair' };
    if (score === 3) return { level: 3, label: 'Good',   cls: 'good' };
    return              { level: 4, label: 'Strong', cls: 'strong' };
  }

  function initStrengthMeter() {
    const input = document.getElementById('signup-password');
    const bars  = [document.getElementById('sb1'), document.getElementById('sb2'), document.getElementById('sb3'), document.getElementById('sb4')];
    const label = document.getElementById('strength-label');
    input.addEventListener('input', () => {
      const pw = input.value;
      if (!pw) { bars.forEach(b => b.className = ''); label.textContent = ''; return; }
      const { level, label: lbl, cls } = getStrength(pw);
      bars.forEach((b, i) => b.className = i < level ? cls : '');
      label.textContent = lbl;
      label.style.color = { weak: '#f87171', fair: '#fbbf24', good: '#60a5fa', strong: '#34d399' }[cls];
    });
  }

  async function handleLogin(e) {
    e.preventDefault();
    hideAlert('login-alert');
    const email    = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    const v1 = validateField(email, email.value && /\S+@\S+\.\S+/.test(email.value));
    const v2 = validateField(password, password.value.trim());
    if (!v1 || !v2) return;
    setLoading('login-btn', true, 'Sign In');
    try {
      const { token, user } = await api.auth.login({ email: email.value, password: password.value });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      App.showApp(user);
    } catch (err) {
      showAlert('login-alert', err.message);
    } finally {
      setLoading('login-btn', false, 'Sign In');
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    hideAlert('signup-alert');
    const name     = document.getElementById('signup-name');
    const email    = document.getElementById('signup-email');
    const password = document.getElementById('signup-password');
    const confirm  = document.getElementById('signup-confirm');
    const v1 = validateField(name, name.value.trim());
    const v2 = validateField(email, email.value && /\S+@\S+\.\S+/.test(email.value));
    const v3 = validateField(password, password.value.length >= 6);
    const v4 = validateField(confirm, confirm.value === password.value && confirm.value.length > 0);
    if (!v1 || !v2 || !v3 || !v4) return;
    setLoading('signup-btn', true, 'Create Account');
    try {
      const { token, user } = await api.auth.signup({ name: name.value.trim(), email: email.value, password: password.value });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      App.showApp(user);
    } catch (err) {
      showAlert('signup-alert', err.message);
    } finally {
      setLoading('signup-btn', false, 'Create Account');
    }
  }

  function init() {
    initPasswordToggles();
    initStrengthMeter();

    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);

    document.getElementById('go-signup').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-page').style.display = 'none';
      document.getElementById('signup-page').style.display = 'flex';
    });
    document.getElementById('go-login').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('signup-page').style.display = 'none';
      document.getElementById('login-page').style.display = 'flex';
    });
  }

  return { init };
})();
