import { transactionApi, categoryApi, accountApi, beneficiaryApi } from '../api/client.js';

export function TransactionForm(onSuccess, onCancel) {
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

  let allCategories = [];

  container.innerHTML = `
    <h2 style="margin-bottom: 1.5rem;">Nueva Transacción</h2>
    <form id="transaction-form">
      <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
        <label style="flex: 1; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border: 1px solid var(--glass-border); border-radius: var(--radius);">
          <input type="radio" name="tipo" value="INGRESO" checked> Ingreso
        </label>
        <label style="flex: 1; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border: 1px solid var(--glass-border); border-radius: var(--radius);">
          <input type="radio" name="tipo" value="EGRESO"> Egreso
        </label>
      </div>

      <div class="input-group">
        <label>Descripción</label>
        <input type="text" id="descripcion" placeholder="Ejem: Compra de café" required>
      </div>

      <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="input-group">
          <label>Monto</label>
          <input type="number" id="monto" placeholder="0.00" required>
        </div>
        <div class="input-group">
          <label>Fecha</label>
          <input type="date" id="fecha" required>
        </div>
      </div>

      <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="input-group">
          <label>Cuenta</label>
          <select id="cuentaId" required style="width: 100%; padding: 0.75rem; background: var(--surface); border: 1px solid var(--glass-border); border-radius: var(--radius); color: var(--text);">
            <option value="">Seleccionar cuenta</option>
          </select>
        </div>
        <div class="input-group">
          <label>Categoría</label>
          <select id="categoriaId" required style="width: 100%; padding: 0.75rem; background: var(--surface); border: 1px solid var(--glass-border); border-radius: var(--radius); color: var(--text);">
            <option value="">Seleccionar categoría</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <label>Beneficiario (Opcional)</label>
        <select id="beneficiarioId" style="width: 100%; padding: 0.75rem; background: var(--surface); border: 1px solid var(--glass-border); border-radius: var(--radius); color: var(--text);">
          <option value="0">Sin beneficiario</option>
        </select>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button type="button" id="cancel-btn" class="btn btn-ghost" style="flex: 1;">Cancelar</button>
        <button type="submit" class="btn btn-primary" style="flex: 1;">Guardar</button>
      </div>
    </form>
  `;

  overlay.appendChild(container);

  const filterCategories = (tipo) => {
    const catSelect = container.querySelector('#categoriaId');
    const filtered = allCategories.filter(c => c.tipo === tipo);
    catSelect.innerHTML = `<option value="">Seleccionar categoría (${tipo})</option>` + 
      filtered.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
  };

  const loadOptions = async () => {
    try {
      const [accountsRes, categoriesRes, beneficiariesRes] = await Promise.all([
        accountApi.list(),
        categoryApi.list(),
        beneficiaryApi.list()
      ]);
      
      allCategories = categoriesRes.data;

      if (allCategories.length === 0) {
        alert('Debe existir al menos una categoría antes de registrar movimientos.');
        overlay.remove();
        onCancel();
        return;
      }

      const accSelect = container.querySelector('#cuentaId');
      const benSelect = container.querySelector('#beneficiarioId');

      accSelect.innerHTML = `<option value="">Seleccionar cuenta</option>` + 
        accountsRes.data.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('');
      
      benSelect.innerHTML = `<option value="0">Sin beneficiario</option>` + 
        beneficiariesRes.data.map(b => `<option value="${b.id}">${b.nombre}</option>`).join('');

      filterCategories('INGRESO'); // Default checked
    } catch (e) { 
      console.error(e);
      alert('Error cargando opciones: ' + e.message);
    }
  };

  // Switch categories when type changes
  container.querySelectorAll('input[name="tipo"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      filterCategories(e.target.value);
    });
  });

  container.querySelector('#transaction-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const catId = container.querySelector('#categoriaId').value;
    if (!catId) {
      alert('Debe seleccionar una categoría');
      return;
    }

    const data = {
      workspaceId: parseInt(localStorage.getItem('active_workspace_id')),
      tipo: container.querySelector('input[name="tipo"]:checked').value,
      descripcion: container.querySelector('#descripcion').value,
      monto: parseFloat(container.querySelector('#monto').value),
      fecha: container.querySelector('#fecha').value,
      cuentaId: parseInt(container.querySelector('#cuentaId').value),
      categoriaId: parseInt(catId),
      beneficiarioId: parseInt(container.querySelector('#beneficiarioId').value),
      itemPresupuestoId: 0
    };

    const submitBtn = container.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    try {
      await transactionApi.create(data);
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

  loadOptions();
  return overlay;
}
