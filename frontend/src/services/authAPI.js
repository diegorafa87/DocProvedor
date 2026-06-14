import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001');

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptador para adicionar token às requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptador para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/api/user/login', { email, password }),
  criarUsuario: (email, name, consultoria, password) => api.post('/api/user/criar', { email, name, consultoria, password }),
  listarMeusClientes: () => api.get('/api/user/meus-clientes'),
  alterarSenhaCliente: (email, senhaAtual, novaSenha) => api.post('/api/user/alterar-senha', { email, senhaAtual, novaSenha }),
  listarTodosUsuarios: () => api.get('/api/user/all'),
  getClientes: (consultoria) => api.get(`/api/user/clientes?consultoria=${encodeURIComponent(consultoria)}`),
  validarCliente: (email, consultoria) => api.post('/api/user/validar-cliente', { email, consultoria }),
};

export default api;
