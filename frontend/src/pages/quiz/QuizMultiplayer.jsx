import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { quizAPI } from '../../api/quiz.api';
import Loading from '../../components/common/Loading';

const QuizMultiplayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [answers, setAnswers] = useState({ 0: {}, 1: {} });
  const [scores, setScores] = useState({ 0: 0, 1: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [xpFlash, setXpFlash] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [finished, setFinished] = useState(false);

  const players = ['You', 'Friend'];

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizAPI.getById(id);
        setQuiz(response.data.data);
      } catch (error) {
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const totalQuestions = quiz?.questions?.length || 0;
  const currentQuestion = quiz?.questions?.[currentIndex];

  const progressPercent = useMemo(() => {
    if (!totalQuestions) return 0;
    return Math.round(((currentIndex + 1) / totalQuestions) * 100);
  }, [currentIndex, totalQuestions]);

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    try {
      return JSON.parse(currentQuestion.options);
    } catch (error) {
      return [];
    }
  }, [currentQuestion]);

  const handleConfirm = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    const updatedAnswers = {
      ...answers[currentPlayer],
      [String(currentQuestion.id)]: selectedAnswer
    };

    setAnswers((prev) => ({
      ...prev,
      [currentPlayer]: updatedAnswers
    }));

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer('');
      return;
    }

    setCalculating(true);
    try {
      const response = await quizAPI.scoreAttempt(id, updatedAnswers);
      const scored = response.data.data;
      setScores((prev) => ({
        ...prev,
        [currentPlayer]: scored.score || 0
      }));

      if (scored.score) {
        setXpFlash(`+${scored.score} XP`);
        setTimeout(() => setXpFlash(null), 1200);
      }
    } catch (error) {
      setScores((prev) => ({
        ...prev,
        [currentPlayer]: 0
      }));
    } finally {
      setCalculating(false);
    }

    if (currentPlayer === 0) {
      setCurrentPlayer(1);
      setCurrentIndex(0);
      setSelectedAnswer('');
      return;
    }

    setFinished(true);
  };

  const resetMatch = () => {
    setCurrentIndex(0);
    setCurrentPlayer(0);
    setAnswers({ 0: {}, 1: {} });
    setScores({ 0: 0, 1: 0 });
    setSelectedAnswer('');
    setFinished(false);
  };

  if (loading) return <Loading />;
  if (!quiz) return <div className="text-center py-12 text-gray-400">Quiz not found</div>;

  if (finished) {
    const winner = scores[0] === scores[1] ? 'It\'s a tie!' : scores[0] > scores[1] ? 'You win!' : 'Friend wins!';

    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="card text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold text-white mb-2">{winner}</h1>
            <p className="text-gray-400 mb-6">Final scores</p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card-solid">
                <div className="text-sm text-gray-400 mb-1">You</div>
                <div className="text-3xl font-bold text-white">{scores[0]}</div>
              </div>
              <div className="card-solid">
                <div className="text-sm text-gray-400 mb-1">Friend</div>
                <div className="text-3xl font-bold text-white">{scores[1]}</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="btn-primary" onClick={resetMatch}>Play Again</button>
              <button className="btn-secondary" onClick={() => navigate('/quiz')}>Back to Quiz Hub</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Multiplayer Quiz</h1>
            <p className="text-gray-400 text-sm">Turn: {players[currentPlayer]}</p>
          </div>
          <div className="text-sm text-gray-400">Question {currentIndex + 1} of {totalQuestions}</div>
        </div>

        <div className="card-solid mb-6">
          <div className="progress-bar h-2">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">{currentQuestion?.questionText}</h2>
          <div className="grid gap-3">
            {options.map((option) => (
              <motion.button
                key={option}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedAnswer(option)}
                className={`quiz-option ${selectedAnswer === option ? 'selected' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-100">{option}</span>
                  {selectedAnswer === option && <span className="text-accent-purple">✓</span>}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">Scores: You {scores[0]} • Friend {scores[1]}</div>
          <button className="btn-primary" onClick={handleConfirm} disabled={!selectedAnswer || calculating}>
            {calculating ? 'Scoring...' : 'Confirm & Next'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {xpFlash && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-24 right-8 bg-dark-800/90 border border-accent-purple/30 text-accent-purple px-4 py-2 rounded-xl shadow-glow"
          >
            {xpFlash}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizMultiplayer;
