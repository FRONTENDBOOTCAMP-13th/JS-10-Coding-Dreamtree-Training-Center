import { isAuthenticated, clearAuthState } from '../service/auth.ts';

window.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-header-btn');
  if (!loginBtn) return;

  function updateLoginButton() {
    if (!loginBtn) return;

    const isLoggedIn = isAuthenticated();

    if (isLoggedIn) {
      loginBtn.innerHTML = `
        <button type="button" class="bg-quokka-brown text-white rounded-4xl px-4 py-1.5 text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer">
          로그아웃
        </button>
      `;

      loginBtn.onclick = function (e) {
        e.preventDefault();
        clearAuthState();
        window.location.href = '/';
      };

      loginBtn.removeAttribute('href');
    } else {
      loginBtn.innerHTML = `
        <button type="button" class="bg-quokka-brown text-white rounded-4xl px-4 py-1.5 text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer">
          로그인
        </button>
      `;

      loginBtn.onclick = null;
      loginBtn.setAttribute('href', '/src/pages/login.html');
    }
  }

  updateLoginButton();
  window.addEventListener('storage', updateLoginButton);
});
