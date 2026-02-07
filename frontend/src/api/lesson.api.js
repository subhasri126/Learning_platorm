import axios from './axios';

export const lessonAPI = {
  getByCourse: (courseId) => axios.get(`/lessons/course/${courseId}`),
  getById: (id) => axios.get(`/lessons/${id}`),
  create: (data) => axios.post('/lessons', data),
  update: (id, data) => axios.put(`/lessons/${id}`, data),
  delete: (id) => axios.delete(`/lessons/${id}`)
};
