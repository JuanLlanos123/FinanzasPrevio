import { categoryApi } from '../api/client.js';

export function CategoryManager(onClose) {
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
      <h2>Categorías</h2>
      <button id="close-btn" class="btn btn-ghost" style="padding: 0.5rem;">✕</button>
    </div>

    <form id="category-form" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
      <input type="text" id="cat-nombre" placeholder="Nombre de categoría" style="flex: 2; padding: 0.75rem; background: var(--surface); border: 1px solid var(--glass-border); border-radius: var(--radius); color: var(--text);" required>
      <select id="cat-tipo" style="flex: 1; padding: 0.75rem; background: var(--surface); border: 1px solid var(--glass-border); border-radius: var(--radius); color: var(--text);">
        <option value="INGRESO">Ingreso</option>
        <option value="EGRESO">Egreso</option>
      </select>
      <button type="submit" class="btn btn-primary">Añadir</button>
    </form>

    <div id="categories-list" style="max-height: 300px; overflow-y: auto; display: grid; gap: 0.5rem;">
      <p>Cargando categorías...</p>
    </div>
  `;

  overlay.appendChild(container);

  const refreshCategories = async () => {
    try {
      const response = await categoryApi.list();
      const list = container.querySelector('#categories-list');
      list.innerHTML = response.data.map(c => `
        <div style="padding: 0.75rem 1rem; background: var(--surface-light); border-radius: var(--radius); display: flex; justify-content: space-between;">
          <span>${c.nombre}</span>
          <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 4px; background: ${c.tipo === 'INGRESO' ? 'var(--success)' : 'var(--danger)'}44; color: ${c.tipo === 'INGRESO' ? 'var(--success)' : 'var(--danger)'}">
            ${c.tipo}
          </span>
        </div>
      `).join('');
    } catch (e) { console.error(e); }
  };

  container.querySelector('#category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      workspaceId: parseInt(localStorage.getItem('active_workspace_id')),
      nombre: container.querySelector('#cat-nombre').value,
      tipo: container.querySelector('#cat-tipo').value
    };
    const submitBtn = container.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '...';

    try {
      await categoryApi.create(data);
      container.querySelector('#cat-nombre').value = '';
      refreshCategories();
    } catch (e) {
      alert(e.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Añadir';
    }
  });

  container.querySelector('#close-btn').addEventListener('click', () => {
    overlay.remove();
    onClose();
  });

  refreshCategories();
  return overlay;
}
