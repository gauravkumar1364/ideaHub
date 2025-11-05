export const API_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'https://ideahub-backend.onrender.com';

export const API = `${API_URL}/api`;