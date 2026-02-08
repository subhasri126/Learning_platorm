import axios from './axios';

export const roomAPI = {
  create: (payload) => axios.post('/rooms/create', payload),
  join: (payload) => axios.post('/rooms/join', payload),
  updateStatus: (payload) => axios.post('/rooms/status', payload),
  submitAnswer: (payload) => axios.post('/rooms/answer', payload),
  end: (payload) => axios.post('/rooms/end', payload),
};
