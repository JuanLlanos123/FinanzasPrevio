console.log('Main.js loading...');
import { apiClient } from './api/client.js';

import { LoginPage } from './pages/Login.js';
import { RegisterPage } from './pages/Register.js';
import { WorkspaceSelector } from './components/WorkspaceSelector.js';
import { Dashboard } from './pages/Dashboard.js';

const app = document.getElementById('app');

function navigate(component) {
  app.innerHTML = '';
  app.appendChild(component);
}

export function initApp() {
  const token = localStorage.getItem('auth_token');
  const activeWsId = localStorage.getItem('active_workspace_id');

  if (!token) {
    showLogin();
  } else if (!activeWsId) {
    showWorkspaces();
  } else {
    showDashboard();
  }
}

function showLogin() {
  navigate(LoginPage(
    () => showWorkspaces(), // onLoginSuccess
    () => showRegister()    // onGoToRegister
  ));
}

function showRegister() {
  navigate(RegisterPage(
    () => showWorkspaces(),   // onRegisterSuccess
    () => showLogin()    // onGoToLogin
  ));
}

function showWorkspaces() {
  navigate(WorkspaceSelector((id) => {
    localStorage.setItem('active_workspace_id', id);
    showDashboard();
  }));
}

function showDashboard() {
  navigate(Dashboard());
}

// Initial boot
initApp();
