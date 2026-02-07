import axios from './axios';

export const progressAPI = {
  markLessonComplete: (lessonId) => axios.post(`/progress/lessons/${lessonId}/complete`),
  getDashboard: () => axios.get('/progress/dashboard'),
  getCourseProgress: (courseId) => axios.get(`/progress/courses/${courseId}`)
};
