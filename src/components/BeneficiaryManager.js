import { beneficiaryApi } from '../api/client.js';

export function BeneficiaryManager(onClose) {
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
      <h2>Beneficiarios</h2>
      <button id="close-btn" class="btn btn-ghost" style="padding: 0.5rem;">✕</button>
    </div>

    <form id="beneficiary-form" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
      <input type="text" id="ben-nombre" placeholder="Nombre del beneficiario" style="flex: 2; padding: 0.75rem; background: var(--surface); border: 1px solid var(--glass-border); border-radius: var(--radius); color: var(--text);" required>
      <button type="submit" class="btn btn-primary">Añadir</button>
    </form>

    <div id="beneficiaries-list" style="max-height: 300px; overflow-y: auto; display: grid; gap: 0.5rem;">
      <p>Cargando beneficiarios...</p>
    </div>
  `;

  overlay.appendChild(container);

  const refreshBeneficiaries = async () => {
    try {
      const response = await beneficiaryApi.list();
      const list = container.querySelector('#beneficiaries-list');
      
      if (response.data.length === 0) {
        list.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">No hay beneficiarios registrados.</p>';
        return;
      }

      list.innerHTML = response.data.map(b => `
        <div style="padding: 0.75rem 1rem; background: var(--surface-light); border-radius: var(--radius); display: flex; justify-content: space-between; align-items: center;">
          <span>${b.nombre}</span>
          <span style="font-size: 0.7rem; color: var(--text-muted);">ID: ${b.id}</span>
        </div>
      `).join('');
    } catch (e) { 
      console.error(e);
      container.querySelector('#beneficiaries-list').innerHTML = `<p style="color: var(--danger);">Error al cargar beneficiarios</p>`;
    }
  };

  container.querySelector('#beneficiary-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      workspaceId: parseInt(localStorage.getItem('active_workspace_id')),
      nombre: container.querySelector('#ben-nombre').value
    };
    const submitBtn = container.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '...';

    try {
      await beneficiaryApi.create(data);
      container.querySelector('#ben-nombre').value = '';
      refreshBeneficiaries();
    } catch (e) { 
      alert('Error al crear beneficiario: ' + e.message); 
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Añadir';
    }
  });

  container.querySelector('#close-btn').addEventListener('click', () => {
    overlay.remove();
    onClose();
  });

  refreshBeneficiaries();
  return overlay;
}
