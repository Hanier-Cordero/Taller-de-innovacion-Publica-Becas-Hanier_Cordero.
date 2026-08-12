const form = document.getElementById('loginForm');
const user = document.getElementById('loginUser');
const password = document.getElementById('loginPassword');
const error = document.getElementById('loginError');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const ok = user.value.trim() === '2743006130108' && password.value === 'password';
  if (!ok) {
    error.classList.add('show');
    password.focus();
    return;
  }
  error.classList.remove('show');
  sessionStorage.setItem('becasDemoAuth', '1');
  window.location.href = 'portal.html';
});
[user,password].forEach(el => el.addEventListener('input', () => error.classList.remove('show')));
