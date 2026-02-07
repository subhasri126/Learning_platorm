import axios from './axios';

export const courseAPI = {
  getAll: () => axios.get('/courses'),
  getById: (id) => axios.get(`/courses/${id}`),
  create: (data) => axios.post('/courses', data),
  update: (id, data) => axios.put(`/courses/${id}`, data),
  delete: (id) => axios.delete(`/courses/${id}`),
  getProgress: (id) => axios.get(`/courses/${id}/progress`)
};
