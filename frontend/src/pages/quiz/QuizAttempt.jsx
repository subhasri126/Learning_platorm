import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { quizAPI } from '../../api/quiz.api';
import Loading from '../../components/common/Loading';
import MascotGuide from '../../components/learner/MascotGuide';

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overlayMessage, setOverlayMessage] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [coachMessage, setCoachMessage] = useState({
    emoji: '🧠',
    text: 'This quiz is quick! Take your time and trust yourself.'
  });
  const allowExitRef = useRef(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

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

  useEffect(() => {
    const interrupted = localStorage.getItem(`quizInterrupted:${id}`);
    if (interrupted) {
      navigate(`/quiz/${id}/reattempt`, { state: JSON.parse(interrupted) });
    }
  }, [id, navigate]);

  const fetchQuiz = async () => {
    try {
      const response = await quizAPI.getById(id);
      setQuiz(response.data.data);
    } catch (err) {
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setError('');
    setAnswers((prev) => ({ ...prev, [String(questionId)]: answer }));
  };

  const totalQuestions = quiz?.questions?.length || 0;
  const currentQuestion = quiz?.questions?.[currentIndex];
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : '';

  const progressPercent = useMemo(() => {
    if (!totalQuestions) return 0;
    return Math.round(((currentIndex + 1) / totalQuestions) * 100);
  }, [currentIndex, totalQuestions]);

  const showOverlay = (message, emoji = '👀') => {
    setOverlayMessage({ message, emoji });
    window.setTimeout(() => setOverlayMessage(null), 2200);
  };

  const triggerInterruption = () => {
    if (!quiz) return;
    const currentAttempts = attempts.length;
    const attemptNumber = currentAttempts + 1;
    const payload = {
      attemptNumber,
      maxPoints: quiz.maxPoints,
      title: quiz.title,
      timestamp: Date.now()
    };
    localStorage.setItem(`quizInterrupted:${id}`, JSON.stringify(payload));
    allowExitRef.current = true;
    navigate(`/quiz/${id}/reattempt`, { state: payload, replace: true });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < totalQuestions) {
      setError('Please answer this question before continuing.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await quizAPI.submitAttempt(id, answers);
      navigate(`/quiz/${id}/result`, { state: { result: response.data.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!selectedAnswer) {
      setError('Select an option to continue.');
      return;
    }

    if (currentIndex === totalQuestions - 1) {
      await handleSubmit();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setCoachMessage({
      emoji: '🎯',
      text: "Nice progress! You're doing great."
    });
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const confirmExit = () => {
    allowExitRef.current = true;
    navigate(`/courses/${quiz.courseId}`);
  };

  useEffect(() => {
    const exitWarning = "You're in the middle of a quiz. Leaving now may affect your progress. Are you sure you want to exit?";

    const handleBeforeUnload = (event) => {
      if (allowExitRef.current) return undefined;
      triggerInterruption();
      event.preventDefault();
      event.returnValue = exitWarning;
      return exitWarning;
    };

    const handlePopState = () => {
      if (allowExitRef.current) return;
      setShowExitModal(true);
      window.history.pushState(null, '', window.location.href);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) return;
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          if (next >= 2) {
            triggerInterruption();
          } else {
            showOverlay('You are in the middle of a quiz. Please stay on this tab to continue.', '⚠️');
          }
          return next;
        });
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [attempts, quiz]);

  if (loading) return <Loading />;
  if (!quiz) return <div className="text-center py-12">Quiz not found</div>;

  const options = currentQuestion ? JSON.parse(currentQuestion.options) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
            <p className="text-gray-400 text-sm">One question at a time — stay focused.</p>
          </div>
          <button
            onClick={() => setShowExitModal(true)}
            className="btn-ghost text-sm"
          >
            Exit Quiz
          </button>
        </div>

        <div className="card-solid mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-400">
              Question {currentIndex + 1} of {totalQuestions}
            </div>
            <div className="text-sm text-gray-400">{progressPercent}% complete</div>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              {currentQuestion.questionText}
            </h2>

            <div className="grid gap-3">
              {options.map((option, optIndex) => {
                const selected = selectedAnswer === option;
                return (
                  <motion.button
                    key={optIndex}
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerChange(currentQuestion.id, option)}
                    className={`quiz-option ${selected ? 'selected' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-100">{option}</span>
                      {selected && <span className="text-accent-purple">✓</span>}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="text-xs text-gray-500 mt-4">{currentQuestion.points} points</div>
          </motion.div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="btn-secondary disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            className="btn-primary disabled:opacity-50"
          >
            {submitting
              ? 'Submitting...'
              : currentIndex === totalQuestions - 1
                ? 'Finish Quiz'
                : 'Confirm & Next'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {overlayMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-dark-800/95 border border-dark-700 px-4 py-3 rounded-xl shadow-lg z-50"
          >
            <div className="flex items-center gap-3 text-sm text-gray-100">
              <span className="text-lg">{overlayMessage.emoji}</span>
              <span>{overlayMessage.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="card-solid max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-white mb-2">⚠️ Leave quiz?</h3>
              <p className="text-gray-400 text-sm mb-6">
                You're in the middle of a quiz. Leaving now may affect your progress. Are you sure you want to exit?
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowExitModal(false)} className="btn-secondary">
                  Stay Here
                </button>
                <button onClick={confirmExit} className="btn-danger">
                  Exit Quiz
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <MascotGuide emoji={coachMessage.emoji} message={coachMessage.text} position="bottom-right" />
      </AnimatePresence>
    </div>
  );
};

export default QuizAttempt;
