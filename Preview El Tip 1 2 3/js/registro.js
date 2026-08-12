const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');

registerForm.addEventListener('submit', event => {
  event.preventDefault();
  const dpi = document.getElementById('regDpi').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const passwordConfirm = document.getElementById('regPasswordConfirm').value;
  const captcha = document.getElementById('regCaptcha').checked;
  const passwordsMatch = password === passwordConfirm;
  const valid = registerForm.checkValidity() && /^\d{13}$/.test(dpi) && /^\d{8}$/.test(phone) && password.length >= 8 && passwordsMatch && captcha;
  registerMessage.className = 'register-message show ' + (valid ? 'success' : 'error');
  registerMessage.textContent = valid
    ? 'Registro simulado correctamente. Ya puedes iniciar sesión.'
    : !passwordsMatch
      ? 'Las contraseñas no coinciden. Verifica ambos campos.'
      : 'Completa todos los campos, usa un CUI de 13 dígitos, un teléfono de 8 dígitos y marca “No soy un robot”.';
  if (valid) registerMessage.scrollIntoView({behavior:'smooth',block:'center'});
});
