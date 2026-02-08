import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { progressAPI } from '../../api/progress.api';
import { courseAPI } from '../../api/course.api';
import { quizAPI } from '../../api/quiz.api';
import { roomAPI } from '../../api/room.api';
import Loading from '../../components/common/Loading';
import MascotGuide from '../../components/learner/MascotGuide';
import { useAuth } from '../../contexts/AuthContext';

const QuizHub = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [roomError, setRoomError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await progressAPI.getDashboard();
        setDashboard(response.data.data);
      } catch (error) {
        setDashboard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getAll();
        const data = response.data.data || [];
        setCourses(data);
        if (data.length) {
          setSelectedCourseId(data[0].id);
        }
      } catch (error) {
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!selectedCourseId) return;
      try {
        const response = await quizAPI.getByCourse(selectedCourseId);
        const data = response.data.data || [];
        setQuizzes(data);
        if (data.length) {
          setSelectedQuizId(data[0].id);
        }
      } catch (error) {
        setQuizzes([]);
      }
    };

    fetchQuizzes();
  }, [selectedCourseId]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Quiz Arena</h1>
          <p className="text-gray-400">Pick a course quiz and level up fast.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-solid">
            <div className="text-sm text-gray-400">Quizzes Taken</div>
            <div className="text-2xl font-bold text-white">
              {dashboard?.recentQuizAttempts?.length || 0}
            </div>
          </div>
          <div className="card-solid">
            <div className="text-sm text-gray-400">XP Earned</div>
            <div className="text-2xl font-bold text-white">
              {dashboard?.stats?.totalPoints || 0}
            </div>
          </div>
          <div className="card-solid">
            <div className="text-sm text-gray-400">Next Goal</div>
            <div className="text-2xl font-bold text-white">Complete a quiz</div>
          </div>
        </div>

        <div className="card-solid mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Quiz Attempts</h2>
            <Link to="/courses" className="btn-secondary text-sm">Browse Courses</Link>
          </div>
          {dashboard?.recentQuizAttempts?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboard.recentQuizAttempts.map((attempt, index) => (
                <motion.div
                  key={attempt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card"
                >
                  <div className="text-sm text-gray-400 mb-2">Attempt #{attempt.attemptNumber}</div>
                  {(() => {
                    const max = attempt.quizMaxPoints || attempt.maxPoints || 0;
                    const pct = max ? Math.round((attempt.score / max) * 100) : 0;
                    return (
                      <>
                        <div className="text-2xl font-bold text-white">{pct}%</div>
                        <div className="text-sm text-gray-500">{attempt.score} / {max} XP</div>
                      </>
                    );
                  })()}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No quiz attempts yet. Start a course quiz to see progress here.</div>
          )}
        </div>

        <div className="card-solid mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Multiplayer Quiz Room</h2>
            <span className="text-xs text-gray-400">Real-time sync via room code</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-2">Host a room</h3>
              <p className="text-sm text-gray-400 mb-4">Select a quiz and generate a room code.</p>
              <div className="space-y-3">
                <select
                  className="input-field"
                  value={selectedCourseId}
                  onChange={(event) => setSelectedCourseId(event.target.value)}
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
                <select
                  className="input-field"
                  value={selectedQuizId}
                  onChange={(event) => setSelectedQuizId(event.target.value)}
                >
                  {quizzes.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                  ))}
                </select>
                <button
                  className="btn-primary w-full"
                  disabled={!selectedQuizId}
                  onClick={async () => {
                    if (!selectedQuizId) return;
                    setRoomError('');
                    try {
                      const response = await roomAPI.create({
                        quizId: selectedQuizId,
                        playerId: localStorage.getItem('quizPlayerId') || undefined,
                        playerName: user?.name || localStorage.getItem('playerName') || 'Host'
                      });
                      const roomCode = response.data?.data?.code;
                      if (roomCode) {
                        navigate(`/quiz/room/${roomCode}`);
                      } else {
                        setRoomError('Unable to create room. Please try again.');
                      }
                    } catch (error) {
                      setRoomError(error.response?.data?.message || 'Unable to create room. Please try again.');
                    }
                  }}
                >
                  Create Room
                </button>
              </div>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-2">Join a room</h3>
              <p className="text-sm text-gray-400 mb-4">Enter a room code to join.</p>
              <input
                className="input-field mb-3"
                placeholder="Enter room code"
                value={roomCodeInput}
                onChange={(event) => setRoomCodeInput(event.target.value)}
              />
              <button
                className="btn-secondary w-full"
                onClick={() => {
                  const trimmed = roomCodeInput.trim().toUpperCase();
                  if (!trimmed) return;
                  setRoomError('');
                  navigate(`/quiz/room/${trimmed}`);
                }}
              >
                Join Room
              </button>
              {roomError && (
                <div className="text-xs text-red-400 mt-3">{roomError}</div>
              )}
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">Rooms sync across tabs/devices using the same code.</div>
        </div>

        <div className="card-gradient text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready for a new challenge?</h2>
          <p className="text-gray-300 mb-6">Pick a course quiz and earn XP with every correct answer.</p>
          <Link to="/courses" className="btn-primary">Find a Quiz</Link>
        </div>
      </div>

      <MascotGuide emoji="🧠" message="Stay focused — you’ve got this!" position="bottom-right" />
    </div>
  );
};

export default QuizHub;
