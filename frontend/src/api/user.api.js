import axios from './axios';

export const userAPI = {
  getAll: () => axios.get('/users'),
  getById: (id) => axios.get(`/users/${id}`),
  getLeaderboard: (limit = 10) => axios.get(`/users/leaderboard?limit=${limit}`),
  getCourseStats: (courseId) => axios.get(`/users/courses/${courseId}/stats`)
};
