import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { quizAPI } from '../../api/quiz.api';
import Loading from '../../components/common/Loading';
import MascotGuide from '../../components/learner/MascotGuide';

const QuizReattempt = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const interruptedData = location.state || (() => {
    const stored = localStorage.getItem(`quizInterrupted:${id}`);
    return stored ? JSON.parse(stored) : null;
  })();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizResponse, attemptResponse] = await Promise.all([
          quizAPI.getById(id),
          quizAPI.getAttempts(id)
        ]);
        setQuiz(quizResponse.data.data);
        setAttempts(attemptResponse.data.data || []);
      } catch (error) {
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    return () => {
      localStorage.removeItem(`quizInterrupted:${id}`);
    };
  }, [id]);

  const attemptNumber = interruptedData?.attemptNumber || attempts.length + 1;
  const maxAttempts = quiz?.maxAttempts || 4;
  const maxPoints = interruptedData?.maxPoints || quiz?.maxPoints || 0;
  const pointsMultiplier = Math.max(0.5, 1 - ((attemptNumber - 1) * 0.1));
  const adjustedPoints = Math.round(maxPoints * pointsMultiplier);

  const attemptLabel = useMemo(() => {
    return `Attempt ${attemptNumber} of ${maxAttempts}`;
  }, [attemptNumber, maxAttempts]);

  if (loading) return <Loading />;
  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="card-solid text-center max-w-md">
          <p className="text-gray-400">Quiz not found.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="card text-center">
          <div className="text-6xl mb-4">🔁</div>
          <h1 className="text-2xl font-bold text-white mb-2">Looks like the quiz was interrupted.</h1>
          <p className="text-gray-400 mb-6">Let’s try again!</p>

          <div className="card-solid text-left mb-6">
            <div className="text-sm text-gray-400 mb-1">{attemptLabel}</div>
            <div className="text-lg font-semibold text-white">{quiz.title}</div>
            <div className="text-xs text-gray-500 mt-1">Stay focused to keep your full score.</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="card-solid text-left">
              <div className="text-xs text-gray-400 mb-1">First attempt</div>
              <div className="text-lg font-semibold text-white">{maxPoints} XP</div>
            </div>
            <div className="card-solid text-left">
              <div className="text-xs text-gray-400 mb-1">This attempt</div>
              <div className="text-lg font-semibold text-white">{adjustedPoints} XP</div>
              <div className="text-xs text-gray-500 mt-1">Reduced points for reattempts.</div>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem(`quizInterrupted:${id}`);
              navigate(`/quiz/${id}`);
            }}
            className="btn-primary"
          >
            Reattempt Quiz
          </button>
        </div>
      </div>

      <MascotGuide emoji="🔁" message="Let’s reset and go again. You’ve got this!" position="bottom-right" />
    </div>
  );
};

export default QuizReattempt;
