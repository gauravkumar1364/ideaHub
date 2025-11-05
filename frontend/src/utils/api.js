export const API_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:5000';

export const API = `${API_URL}/api`;