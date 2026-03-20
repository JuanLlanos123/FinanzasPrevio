import { authApi } from '../api/client.js';

export function RegisterPage(onRegisterSuccess, onBackToLogin) {
  const container = document.createElement('div');
  container.className = 'login-container card';
  
  container.innerHTML = `
    <h1>Únete a nosotros</h1>
    <p class="subtitle" style="margin-bottom: 2rem; color: var(--text-muted);">Crea tu cuenta de finanzas</p>
    
    <form id="register-form">
      <div class="input-group">
        <label for="nombre">Nombre Completo</label>
        <input type="text" id="nombre" placeholder="Juan Pérez" required>
      </div>
      <div class="input-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" placeholder="tu@email.com" required>
      </div>
      <div class="input-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" placeholder="••••••••" required>
      </div>
      
      <div id="error-message" style="color: var(--danger); margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
      
      <button type="submit" class="btn btn-primary" style="width: 100%;">
        Crear Cuenta
      </button>
    </form>
    
    <p style="margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-muted);">
      ¿Ya tienes cuenta? <a href="#" id="back-to-login" style="color: var(--primary); font-weight: 600;">Inicia sesión</a>
    </p>
  `;

  const form = container.querySelector('#register-form');
  const errorMsg = container.querySelector('#error-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = form.querySelector('#nombre').value;
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    
    const submitBtn = form.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrando...';
    errorMsg.style.display = 'none';

    try {
      const response = await authApi.register({ nombre, email, password });
      apiClient.setToken(response.data.token);
      if (response.data.id) {
        localStorage.setItem('usuario_id', response.data.id);
      }
      onRegisterSuccess();
    } catch (error) {
      errorMsg.textContent = error.message;
      errorMsg.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Crear Cuenta';
    }
  });

  container.querySelector('#back-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    onBackToLogin();
  });

  return container;
}
