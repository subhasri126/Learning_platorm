import axios from './axios';

export const quizAPI = {
  getByCourse: (courseId) => axios.get(`/quizzes/course/${courseId}`),
  getById: (id) => axios.get(`/quizzes/${id}`),
  create: (data) => axios.post('/quizzes', data),
  addQuestion: (quizId, data) => axios.post(`/quizzes/${quizId}/questions`, data),
  submitAttempt: (quizId, answers) => axios.post(`/quizzes/${quizId}/attempt`, { answers }),
  getAttempts: (quizId) => axios.get(`/quizzes/${quizId}/attempts`)
};
