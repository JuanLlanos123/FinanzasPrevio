import { accountApi, transactionApi } from '../api/client.js';

export function Dashboard() {
  const container = document.createElement('div');
  container.className = 'dashboard-container';
  
  container.innerHTML = `
    <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; padding: 1rem 0; border-bottom: 1px solid var(--glass-border);">
      <div>
        <h1 style="font-size: 2.5rem; margin-bottom: 0.25rem;">Panel de Control</h1>
        <p style="color: var(--text-muted); font-weight: 500;">Gestiona tu libertad financiera</p>
      </div>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: flex-end;">
        <button id="manage-cards-btn" class="btn btn-ghost">💳 Tarjetas</button>
        <button id="pay-card-btn" class="btn btn-ghost">💸 Pagar Tarjeta</button>
        <button id="manage-categories-btn" class="btn btn-ghost">📂 Categorías</button>
        <button id="manage-beneficiaries-btn" class="btn btn-ghost">👤 Beneficiarios</button>
        <button id="new-transaction-btn" class="btn btn-primary" style="box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);">+ Transacción</button>
        <button id="logout-btn" class="btn btn-ghost" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.2);">Cerrar Sesión</button>
      </div>
    </header>

    <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
      <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));">
        <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--primary);"></div>
        <span style="color: var(--text-muted); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Balance Total</span>
        <h2 id="total-balance" style="font-size: 2.25rem; font-weight: 700; margin-top: 0.5rem;">$0.00</h2>
      </div>
      <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));">
        <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--success);"></div>
        <span style="color: var(--text-muted); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Ingresos del Mes</span>
        <h2 id="monthly-income" style="color: var(--success); font-size: 2.25rem; font-weight: 700; margin-top: 0.5rem;">$0.00</h2>
      </div>
      <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));">
        <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--danger);"></div>
        <span style="color: var(--text-muted); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">Gastos del Mes</span>
        <h2 id="monthly-expenses" style="color: var(--danger); font-size: 2.25rem; font-weight: 700; margin-top: 0.5rem;">$0.00</h2>
      </div>
    </div>

    <div class="content-grid" style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; align-items: start;">
      <section>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.25rem;">Tus Cuentas</h3>
          <button id="add-account-btn" class="btn btn-ghost" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">+ Agregar</button>
        </div>
        <div id="accounts-list" style="display: grid; gap: 1rem;">
          <p style="color: var(--text-muted);">Cargando cuentas...</p>
        </div>
      </section>
      
      <section>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.25rem;">Actividad Reciente</h3>
        </div>
        <div id="transactions-list" class="card" style="padding: 0; overflow: hidden;">
          <div style="padding: 2rem; text-align: center; color: var(--text-muted);">Cargando transacciones...</div>
        </div>
      </section>
    </div>
  `;

  const loadData = async () => {
    try {
      const [accountsRes, transactionsRes] = await Promise.all([
        accountApi.list(),
        transactionApi.list()
      ]);

      const accounts = accountsRes.data;
      const transactions = transactionsRes.data;

      // Update Accounts
      const accountsList = container.querySelector('#accounts-list');
      if (accounts.length === 0) {
        accountsList.innerHTML = '<div class="card" style="text-align: center; color: var(--text-muted);">No tienes cuentas configuradas.</div>';
      } else {
        accountsList.innerHTML = accounts.map(acc => `
          <div class="card" style="padding: 1.25rem; background: var(--surface-light); border: 1px solid rgba(255,255,255,0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <strong style="font-size: 1.1rem;">${acc.nombre}</strong>
              <span style="font-weight: 700; color: var(--text);">${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(acc.valorInicial)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
              <span>${acc.tipoCuenta}</span>
              <span>Balance Inicial</span>
            </div>
          </div>
        `).join('');
      }

      // Update Transactions
      const transList = container.querySelector('#transactions-list');
      if (transactions.length === 0) {
        transList.innerHTML = '<div style="padding: 3rem; text-align: center; color: var(--text-muted);">No hay transacciones aún. Empieza registrando una.</div>';
      } else {
        transList.innerHTML = transactions.slice(0, 8).map((t, idx) => `
          <div style="padding: 1.25rem 1.75rem; border-bottom: ${idx === transactions.slice(0, 8).length - 1 ? 'none' : '1px solid var(--glass-border)'}; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
            <div style="display: flex; gap: 1rem; align-items: center;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: ${t.tipo === 'EGRESO' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; display: flex; align-items: center; justify-content: center; color: ${t.tipo === 'EGRESO' ? 'var(--danger)' : 'var(--success)'}; font-size: 1.2rem;">
                ${t.tipo === 'EGRESO' ? '↓' : '↑'}
              </div>
              <div>
                <div style="font-weight: 600; font-size: 1rem;">${t.descripcion}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${new Date(t.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })}</div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 700; font-size: 1.1rem; color: ${t.tipo === 'EGRESO' ? 'var(--danger)' : 'var(--success)'}">
                ${t.tipo === 'EGRESO' ? '-' : '+'}${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(t.monto)}
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${t.categoria?.nombre || 'General'}</div>
            </div>
          </div>
        `).join('');
      }

      // Calculate totals
      const totalBalance = accounts.reduce((sum, acc) => sum + acc.valorInicial, 0);
      const monthlyIncome = transactions.filter(t => t.tipo === 'INGRESO').reduce((sum, t) => sum + t.monto, 0);
      const monthlyExpenses = transactions.filter(t => t.tipo === 'EGRESO').reduce((sum, t) => sum + t.monto, 0);

      container.querySelector('#total-balance').textContent = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totalBalance);
      container.querySelector('#monthly-income').textContent = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(monthlyIncome);
      container.querySelector('#monthly-expenses').textContent = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(monthlyExpenses);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  // Event Listeners
  container.querySelector('#logout-btn').onclick = () => {
    localStorage.removeItem('auth_token');
    location.reload();
  };

  import('../components/TransactionForm.js').then(({ TransactionForm }) => {
    container.querySelector('#new-transaction-btn').addEventListener('click', () => {
      document.body.appendChild(TransactionForm(() => loadData(), () => {}));
    });
  });

  import('../components/AccountForm.js').then(({ AccountForm }) => {
    container.querySelector('#add-account-btn').addEventListener('click', () => {
      document.body.appendChild(AccountForm(() => loadData(), () => {}));
    });
  });

  import('../components/CategoryManager.js').then(({ CategoryManager }) => {
    container.querySelector('#manage-categories-btn').addEventListener('click', () => {
      document.body.appendChild(CategoryManager(() => loadData()));
    });
  });

  import('../components/BeneficiaryManager.js').then(({ BeneficiaryManager }) => {
    container.querySelector('#manage-beneficiaries-btn').addEventListener('click', () => {
      document.body.appendChild(BeneficiaryManager(() => loadData()));
    });
  });

  import('../components/CreditCardManager.js').then(({ CreditCardManager }) => {
    container.querySelector('#manage-cards-btn').addEventListener('click', () => {
      document.body.appendChild(CreditCardManager(() => loadData()));
    });
  });

  import('../components/PaymentForm.js').then(({ PaymentForm }) => {
    container.querySelector('#pay-card-btn').addEventListener('click', () => {
      document.body.appendChild(PaymentForm(() => loadData(), () => {}));
    });
  });

  loadData();
  return container;
}
