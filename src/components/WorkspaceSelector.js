import { workspaceApi, apiClient } from '../api/client.js';

export function WorkspaceSelector(onWorkspaceSelected) {
  const container = document.createElement('div');
  container.className = 'workspace-selector card';
  container.style.maxWidth = '600px';
  container.style.margin = '2rem auto';
  
  container.innerHTML = `
    <h2 style="margin-bottom: 1.5rem;">Selecciona un Workspace</h2>
    <div id="workspace-list" class="grid" style="display: grid; gap: 1rem;">
      <p>Cargando espacios de trabajo...</p>
    </div>
    <div style="margin-top: 2rem; border-top: 1px solid var(--glass-border); padding-top: 1.5rem;">
      <h3>Crear nuevo Workspace</h3>
      <div class="input-group" style="margin-top: 1rem; display: flex; gap: 0.5rem; align-items: flex-end;">
        <div style="flex: 1;">
          <input type="text" id="new-workspace-name" placeholder="Mi Workspace Personal">
        </div>
        <button id="create-workspace-btn" class="btn btn-primary">Crear</button>
      </div>
    </div>
  `;

  const refreshList = async () => {
    const listElement = container.querySelector('#workspace-list');
    try {
      const response = await workspaceApi.list();
      const workspaces = response.data;
      
      if (workspaces.length === 0) {
        listElement.innerHTML = '<p>No tienes workspaces aún.</p>';
        return;
      }

      listElement.innerHTML = workspaces.map(ws => `
        <div class="card workspace-item" data-id="${ws.id}" style="cursor: pointer; padding: 1rem; display: flex; justify-content: space-between; align-items: center; transition: var(--transition);">
          <div>
            <strong style="display: block;">${ws.nombre}</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Rol: ${ws.rol || 'Miembro'}</span>
          </div>
          <span class="btn btn-ghost btn-sm">Seleccionar</span>
        </div>
      `).join('');

      listElement.querySelectorAll('.workspace-item').forEach(item => {
        item.addEventListener('click', async () => {
          const id = item.dataset.id;
          try {
            await workspaceApi.select(id);
            localStorage.setItem('active_workspace_id', id);
            onWorkspaceSelected(id);
          } catch (error) {
            alert('Error al seleccionar workspace: ' + error.message);
          }
        });
      });
    } catch (error) {
      listElement.innerHTML = `<p style="color: var(--danger);">Error: ${error.message}</p>`;
    }
  };

  container.querySelector('#create-workspace-btn').addEventListener('click', async () => {
    const nombre = container.querySelector('#new-workspace-name').value;
    if (!nombre) return;
    try {
      await apiClient.post('/workspaces', { nombre });
      container.querySelector('#new-workspace-name').value = '';
      refreshList();
    } catch (error) {
      alert('Error al crear workspace: ' + error.message);
    }
  });

  refreshList();
  return container;
}
