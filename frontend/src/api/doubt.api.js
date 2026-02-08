import axios from './axios';

export const doubtAPI = {
  create: (courseId, question) => axios.post('/doubts', { courseId, question }),
  getAll: () => axios.get('/doubts')
};
