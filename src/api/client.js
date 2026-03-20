const BASE_URL = 'https://finanzas-api.ubunifusoft.digital/api';

export const apiClient = {
  token: localStorage.getItem('auth_token'),

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  },

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.mensaje || 'Error en la petición');
      }

      return result;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (user) => apiClient.post('/auth/register', user),
};

export const workspaceApi = {
  list: () => apiClient.get('/workspaces'),
  select: (id) => apiClient.post(`/workspaces/${id}/seleccionar`, {}),
};

export const accountApi = {
  list: () => apiClient.get('/cuentas'),
  create: (data) => apiClient.post('/cuentas', data),
};

export const transactionApi = {
  list: () => apiClient.get('/transactions'),
  create: (data) => apiClient.post('/transactions', data),
};

export const categoryApi = {
  list: () => apiClient.get('/categorias'),
  create: (data) => apiClient.post('/categorias', data),
};

export const beneficiaryApi = {
  list: () => apiClient.get('/beneficiarios'),
  create: (data) => apiClient.post('/beneficiarios', data),
};
