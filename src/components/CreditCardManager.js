import { creditCardApi } from '../api/client.js';

export function CreditCardManager(onClose) {
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
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h2>Tarjetas de Crédito</h2>
      <button id="close-btn" class="btn btn-ghost" style="padding: 0.5rem;">✕</button>
    </div>

    <form id="card-form" style="display: grid; gap: 1rem; margin-bottom: 1.5rem;">
      <div class="input-group">
        <label>Nombre de la Tarjeta</label>
        <input type="text" id="cc-nombre" placeholder="Visa Platinum" required>
      </div>
      <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="input-group">
          <label>Moneda</label>
          <input type="text" id="cc-moneda" value="USD" required>
        </div>
        <div class="input-group">
          <label>Cupo (Límite)</label>
          <input type="number" id="cc-cupo" placeholder="5000" required>
        </div>
      </div>
      <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="input-group">
          <label>Día de Corte</label>
          <input type="number" id="cc-corte" min="1" max="31" required>
        </div>
        <div class="input-group">
          <label>Día de Pago</label>
          <input type="number" id="cc-pago" min="1" max="31" required>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">Añadir Tarjeta</button>
    </form>

    <div id="cards-list" style="margin-top: 1.5rem; max-height: 200px; overflow-y: auto; display: grid; gap: 0.5rem;">
      <p>Cargando tarjetas...</p>
    </div>
  `;

  overlay.appendChild(container);

  const refreshCards = async () => {
    try {
      const workspaceId = parseInt(localStorage.getItem('active_workspace_id'));
      const response = await creditCardApi.list(workspaceId);
      const list = container.querySelector('#cards-list');
      
      if (!response.data || response.data.length === 0) {
        list.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No hay tarjetas registradas.</p>';
        return;
      }

      list.innerHTML = response.data.map(c => `
        <div style="padding: 0.75rem 1rem; background: var(--surface-light); border-radius: var(--radius); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>${c.nombre}</strong> <span style="font-size: 0.75rem; color: var(--text-muted);">${c.moneda}</span>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Cupo: $${c.cupo} | Corte: ${c.diaCorte} | Pago: ${c.diaPago}</div>
          </div>
        </div>
      `).join('');
    } catch (e) {
      console.error(e);
      container.querySelector('#cards-list').innerHTML = `<p style="color: var(--danger);">Error al cargar tarjetas</p>`;
    }
  };

  container.querySelector('#card-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      workspaceId: parseInt(localStorage.getItem('active_workspace_id')),
      nombre: container.querySelector('#cc-nombre').value,
      moneda: container.querySelector('#cc-moneda').value,
      cupo: parseFloat(container.querySelector('#cc-cupo').value),
      diaCorte: parseInt(container.querySelector('#cc-corte').value),
      diaPago: parseInt(container.querySelector('#cc-pago').value)
    };

    const submitBtn = container.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    try {
      await creditCardApi.create(data);
      container.querySelector('#card-form').reset();
      refreshCards();
    } catch (error) {
      alert('Error al crear tarjeta: ' + error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Añadir Tarjeta';
    }
  });

  container.querySelector('#close-btn').addEventListener('click', () => {
    overlay.remove();
    if (onClose) onClose();
  });

  refreshCards();
  return overlay;
}
