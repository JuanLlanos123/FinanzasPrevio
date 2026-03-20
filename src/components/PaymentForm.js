import { creditCardApi, accountApi } from '../api/client.js';

export function PaymentForm(onSuccess, onCancel) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
    display: flex; justify-content: center; align-items: center; z-index: 1000;
  `;

  const container = document.createElement('div');
  container.className = 'card';
  container.style.width = '100%';
  container.style.maxWidth = '500px';

  container.innerHTML = `
    <h2 style="margin-bottom: 1.5rem;">Pagar Tarjeta de Crédito</h2>
    <form id="payment-form">
      <div class="input-group">
        <label>Tarjeta a Pagar</label>
        <select id="tarjetaId" required style="width: 100%; padding: 0.75rem; background: var(--surface); border: 1px solid var(--glass-border); border-radius: var(--radius); color: var(--text);">
          <option value="">Cargando tarjetas...</option>
        </select>
      </div>
      
      <div class="input-group">
        <label>Cuenta de Origen (Fondos)</label>
        <select id="cuentaId" required style="width: 100%; padding: 0.75rem; background: var(--surface); border: 1px solid var(--glass-border); border-radius: var(--radius); color: var(--text);">
          <option value="">Cargando cuentas...</option>
        </select>
      </div>

      <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="input-group">
          <label>Monto a Pagar</label>
          <input type="number" id="monto" placeholder="0.00" required>
        </div>
        <div class="input-group">
          <label>Fecha del Pago</label>
          <input type="date" id="fecha" required>
        </div>
      </div>

      <div class="input-group">
        <label>Descripción</label>
        <input type="text" id="descripcion" placeholder="Pago mensual de tarjeta" required>
      </div>

      <div class="input-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">
        <input type="checkbox" id="saldarCargos" style="width: auto;">
        <label for="saldarCargos" style="margin-bottom: 0;">¿Saldar todos los cargos facturados?</label>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button type="button" id="cancel-btn" class="btn btn-ghost" style="flex: 1;">Cancelar</button>
        <button type="submit" class="btn btn-primary" style="flex: 1;">Pagar</button>
      </div>
    </form>
  `;

  overlay.appendChild(container);

  const loadOptions = async () => {
    try {
      const workspaceId = parseInt(localStorage.getItem('active_workspace_id'));
      const [cardsRes, accountsRes] = await Promise.all([
        creditCardApi.list(workspaceId),
        accountApi.list()
      ]);

      const cardSelect = container.querySelector('#tarjetaId');
      if (!cardsRes.data || cardsRes.data.length === 0) {
        alert('No tienes tarjetas registradas. Crea una primero.');
        onCancel();
        overlay.remove();
        return;
      }
      cardSelect.innerHTML = `<option value="">Seleccionar tarjeta</option>` + 
        cardsRes.data.map(c => `<option value="${c.id}">${c.nombre} (Cupo: $${c.cupo})</option>`).join('');

      const accSelect = container.querySelector('#cuentaId');
      accSelect.innerHTML = `<option value="">Seleccionar cuenta de origen</option>` + 
        accountsRes.data.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('');

    } catch (e) {
      console.error(e);
      alert('Error al cargar opciones: ' + e.message);
    }
  };

  container.querySelector('#payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tarjetaId = container.querySelector('#tarjetaId').value;
    
    const data = {
      cuentaId: parseInt(container.querySelector('#cuentaId').value),
      monto: parseFloat(container.querySelector('#monto').value),
      fecha: container.querySelector('#fecha').value,
      descripcion: container.querySelector('#descripcion').value,
      saldarCargos: container.querySelector('#saldarCargos').checked
    };

    const submitBtn = container.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';

    try {
      await creditCardApi.registerPayment(tarjetaId, data);
      onSuccess();
      overlay.remove();
    } catch (error) {
      alert('Error en el pago: ' + error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Pagar';
    }
  });

  container.querySelector('#cancel-btn').addEventListener('click', () => {
    onCancel();
    overlay.remove();
  });

  loadOptions();
  return overlay;
}
