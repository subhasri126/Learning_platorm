import axios from './axios';

export const authAPI = {
  login: (email, password) => axios.post('/auth/login', { email, password }),
  register: (email, password, name, role) => axios.post('/auth/register', { email, password, name, role }),
  getProfile: () => axios.get('/auth/me')
};
