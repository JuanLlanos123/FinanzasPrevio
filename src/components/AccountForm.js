import { accountApi } from '../api/client.js';

export function AccountForm(onSuccess, onCancel) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
    display: flex; justify-content: center; align-items: center; z-index: 1000;
  `;

  const container = document.createElement('div');
  container.className = 'card';
  container.style.width = '100%';
  container.style.maxWidth = '400px';

  container.innerHTML = `
    <h2 style="margin-bottom: 1.5rem;">Nueva Cuenta</h2>
    <form id="account-form">
      <div class="input-group">
        <label>Nombre de la Cuenta</label>
        <input type="text" id="nombre" placeholder="Ejem: Ahorros Principal" required>
      </div>
      <div class="input-group">
        <label>Valor Inicial</label>
        <input type="number" id="valorInicial" placeholder="0.00" required>
      </div>
      <div class="input-group">
        <label>Tipo de Cuenta</label>
        <select id="tipoCuenta" class="input" style="width: 100%; padding: 0.75rem; background: var(--surface); border: 1px solid var(--glass-border); border-radius: var(--radius); color: var(--text);">
          <option value="AHORROS">Ahorros</option>
          <option value="EFECTIVO">Efectivo</option>
          <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
          <option value="INVERSION">Inversión</option>
        </select>
      </div>
      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button type="button" id="cancel-btn" class="btn btn-ghost" style="flex: 1;">Cancelar</button>
        <button type="submit" class="btn btn-primary" style="flex: 1;">Guardar</button>
      </div>
    </form>
  `;

  overlay.appendChild(container);

  container.querySelector('#account-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      workspaceId: parseInt(localStorage.getItem('active_workspace_id')),
      nombre: container.querySelector('#nombre').value,
      valorInicial: parseFloat(container.querySelector('#valorInicial').value),
      tipoCuenta: container.querySelector('#tipoCuenta').value,
      color: '#6366f1',
      icono: 'wallet'
    };

    const submitBtn = container.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    try {
      await accountApi.create(data);
      onSuccess();
      overlay.remove();
    } catch (error) {
      alert('Error: ' + error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Guardar';
    }
  });

  container.querySelector('#cancel-btn').addEventListener('click', () => {
    onCancel();
    overlay.remove();
  });

  return overlay;
}
