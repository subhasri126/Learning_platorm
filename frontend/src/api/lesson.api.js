import axios from './axios';

export const lessonAPI = {
  getByCourse: (courseId) => axios.get(`/lessons/course/${courseId}`),
  getById: (id) => axios.get(`/lessons/${id}`),
  create: (data) => {
    const isFormData = data instanceof FormData;
    return axios.post('/lessons', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },
  update: (id, data) => {
    const isFormData = data instanceof FormData;
    return axios.put(`/lessons/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },
  delete: (id) => axios.delete(`/lessons/${id}`)
};
