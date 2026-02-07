import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { quizAPI } from '../../api/quiz.api';
import { useAuth } from '../../contexts/AuthContext';
import MascotGuide from '../../components/learner/MascotGuide';
import { getRank } from '../../utils/gamification';

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const result = location.state?.result;
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await quizAPI.getAttempts(id);
        setAttempts(response.data.data || []);
      } catch (error) {
        setAttempts([]);
      }
    };

    fetchAttempts();
  }, [id]);

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="card text-center">
          <p className="text-gray-600">No result data available.</p>
          <button onClick={() => navigate(`/quiz/${id}`)} className="btn-primary mt-4">
            Take Quiz
          </button>
        </div>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.maxPoints) * 100);
  const passed = percentage >= 60;
  const isLowScore = percentage < 60;

  const currentXP = user?.totalPoints || 0;
  const estimatedTotalXP = currentXP + result.score;

  const rankSteps = [
    { name: 'BEGINNER', min: 0, max: 499 },
    { name: 'INTERMEDIATE', min: 500, max: 999 },
    { name: 'ADVANCED', min: 1000, max: 1999 },
    { name: 'EXPERT', min: 2000, max: 2999 },
    { name: 'MASTER', min: 3000, max: 4999 },
    { name: 'LEGEND', min: 5000, max: 999999 }
  ];

  const badgeProgress = useMemo(() => {
    const currentStep = rankSteps.find((step) => estimatedTotalXP >= step.min && estimatedTotalXP <= step.max);
    if (!currentStep) return { name: 'BEGINNER', progress: 0, nextName: 'INTERMEDIATE', nextXP: 500 };
    const nextStep = rankSteps[rankSteps.indexOf(currentStep) + 1];
    const progress = nextStep
      ? Math.round(((estimatedTotalXP - currentStep.min) / (nextStep.min - currentStep.min)) * 100)
      : 100;
    return {
      name: currentStep.name,
      progress: Math.min(100, Math.max(0, progress)),
      nextName: nextStep?.name,
      nextXP: nextStep?.min
    };
  }, [estimatedTotalXP]);

  const previousAttempt = attempts.find((attempt) => attempt.attemptNumber === result.attemptNumber - 1);
  const improved = previousAttempt && result.score > previousAttempt.score;
  const pointsMultiplier = Math.max(0.5, 1 - ((result.attemptNumber - 1) * 0.1));
  const rank = getRank(estimatedTotalXP);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card text-center">
          <div className="mb-6">
            {passed ? (
              <div className="text-6xl mb-4">🎉</div>
            ) : (
              <div className="text-6xl mb-4">💪</div>
            )}
            <h1 className="text-3xl font-bold text-white mb-2">
              {passed ? 'Great job!' : 'Keep going!'}
            </h1>
            <p className="text-gray-400">
              {passed ? 'You completed the quiz!' : 'You can reattempt and score higher.'}
            </p>
          </div>

          <div className="bg-dark-800/70 rounded-2xl p-6 mb-6 border border-dark-700">
            <div className="text-5xl font-bold text-accent-purple mb-2">{percentage}%</div>
            <div className="text-gray-200">
              <span className="font-semibold text-2xl">{result.score}</span>
              <span className="text-gray-400"> / {result.maxPoints} XP</span>
            </div>
            <div className="text-sm text-gray-400 mt-2">Attempt #{result.attemptNumber}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card-solid text-left">
              <div className="text-xs text-gray-400 mb-1">XP Earned</div>
              <div className="text-xl font-semibold text-white">+{result.score}</div>
              <div className="text-xs text-gray-500 mt-1">Multiplier: {Math.round(pointsMultiplier * 100)}%</div>
            </div>
            <div className="card-solid text-left">
              <div className="text-xs text-gray-400 mb-1">Attempts</div>
              <div className="text-xl font-semibold text-white">#{result.attemptNumber}</div>
              <div className="text-xs text-gray-500 mt-1">Remaining: Unlimited</div>
            </div>
            <div className="card-solid text-left">
              <div className="text-xs text-gray-400 mb-1">Current Rank</div>
              <div className={`text-xl font-semibold ${rank.color}`}>{rank.icon} {rank.name}</div>
              <div className="text-xs text-gray-500 mt-1">Estimated XP: {estimatedTotalXP}</div>
            </div>
          </div>

          <div className="card-solid mb-6 text-left">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-300">Progress to next badge</div>
              {badgeProgress.nextName ? (
                <div className="text-xs text-gray-500">Next: {badgeProgress.nextName} at {badgeProgress.nextXP} XP</div>
              ) : (
                <div className="text-xs text-gray-500">Max rank achieved</div>
              )}
            </div>
            <div className="progress-bar h-2">
              <div className="progress-fill" style={{ width: `${badgeProgress.progress}%` }} />
            </div>
          </div>

          {result.attemptNumber > 1 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-200">
                ⚠️ Points decrease by 10% with each attempt (minimum 50%).
              </p>
            </div>
          )}

          {improved && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-200">🚀 Awesome! You just leveled up your understanding!</p>
            </div>
          )}

          <div className="space-y-4 text-left">
            {result.results && result.results.map((item, index) => (
              <div
                key={item.questionId}
                className={`p-4 rounded-lg border ${
                  item.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-200">Question {index + 1}</span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-medium ${
                        item.isCorrect ? 'text-green-300' : 'text-red-300'
                      }`}
                    >
                      {item.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                    </span>
                    <span className="text-sm text-gray-400">+{item.earnedPoints} XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate(`/quiz/${id}`)}
              className="btn-secondary"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <MascotGuide
        emoji={isLowScore ? '🔁' : '🏆'}
        message={
          isLowScore
            ? 'No worries! You can reattempt and improve your score.'
            : 'Nice work finishing this quiz! Be proud of yourself!'
        }
        position="bottom-right"
      />
    </div>
  );
};

export default QuizResult;
