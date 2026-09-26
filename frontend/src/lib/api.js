import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/api/user/auth/login', { email, password });
    return response.data;
  },
  register: async (data) => {
    const response = await api.post('/api/user/auth/register', data);
    return response.data;
  },
  verifyOtp: async (email, otp) => {
    const response = await api.post('/api/user/auth/verify-otp', { email, otp });
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post('/api/user/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (email, otp, newPassword) => {
    const response = await api.post('/api/user/auth/reset-password', { email, otp, newPassword });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/api/user/auth/logout');
    return response.data;
  }
};

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/api/user/profile', data);
    return response.data;
  }
};

export default api;
