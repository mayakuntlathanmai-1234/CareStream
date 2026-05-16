import axios from 'axios';

let baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
if (baseUrl && !baseUrl.endsWith('/api') && !baseUrl.includes('localhost:8080')) {
  baseUrl = `${baseUrl}/api`;
}

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
