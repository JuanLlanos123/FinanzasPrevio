import { authApi, apiClient } from '../api/client.js';

export function LoginPage(onLoginSuccess, onGoToRegister) {
  const container = document.createElement('div');
  container.className = 'login-container card';
  
  container.innerHTML = `
    <h1 style="text-align: center;">Finanzas Pro</h1>
    <p class="subtitle" style="margin-bottom: 2rem; color: var(--text-muted); text-align: center;">Bienvenido de nuevo</p>
    
    <form id="login-form">
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
        Iniciar Sesión
      </button>
    </form>
    
    <p style="margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-muted); text-align: center;">
      ¿No tienes cuenta? <a href="#" id="go-to-register" style="color: var(--primary); font-weight: 600;">Regístrate</a>
    </p>
  `;

  const form = container.querySelector('#login-form');
  const errorMsg = container.querySelector('#error-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    
    const submitBtn = form.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Autenticando...';
    errorMsg.style.display = 'none';

    try {
      const response = await authApi.login({ email, password });
      apiClient.setToken(response.data.token);
      if (response.data.id) {
        localStorage.setItem('usuario_id', response.data.id);
      }
      onLoginSuccess();
    } catch (error) {
      errorMsg.textContent = error.message;
      errorMsg.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Iniciar Sesión';
    }
  });

  container.querySelector('#go-to-register').addEventListener('click', (e) => {
    e.preventDefault();
    onGoToRegister();
  });

  return container;
}
