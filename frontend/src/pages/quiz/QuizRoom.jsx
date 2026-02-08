import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { quizAPI } from '../../api/quiz.api';
import { roomAPI } from '../../api/room.api';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../contexts/AuthContext';

const getPlayerId = () => {
  const existing = localStorage.getItem('quizPlayerId');
  if (existing) return existing;
  const id = `player-${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem('quizPlayerId', id);
  return id;
};

const getSocketUrl = () => {
  const envBase = import.meta?.env?.VITE_API_BASE_URL;
  if (envBase) return envBase.replace('/api', '');
  if (typeof window !== 'undefined') return `http://${window.location.hostname}:5000`;
  return 'http://localhost:5000';
};

const QuizRoom = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [players, setPlayers] = useState([]);
  const [started, setStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [roomLoading, setRoomLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(true);
  const [roomError, setRoomError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [xpFlash, setXpFlash] = useState(null);
  const [questionResults, setQuestionResults] = useState({});
  const [questionCorrectAnswer, setQuestionCorrectAnswer] = useState(null);
  const socketRef = useRef(null);
  const { user } = useAuth();
  const playerId = useMemo(getPlayerId, []);

  // Derived state
  const isHost = room?.hostId === user?.id;

  // Initialize Socket and Fetch Data
  useEffect(() => {
    if (!code) {
      setRoomError('Invalid room code.');
      setRoomLoading(false);
      return;
    }

    const socketUrl = getSocketUrl();
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('joinRoom', code);
    });

    socket.on('playerJoined', (newPlayer) => {
      setPlayers((prev) => {
        const exists = prev.some((p) => p.playerId === newPlayer.playerId);
        if (exists) return prev;
        return [...prev, newPlayer];
      });
    });

    socket.on('quizStarted', () => {
      setStarted(true);
      setQuizEnded(false);
    });

    socket.on('quizEnded', (data) => {
      setQuizEnded(true);
      setStarted(false);
      if (data?.players) setPlayers(data.players);
    });

    socket.on('state', (data) => {
      if (data.started !== undefined) setStarted(data.started);
      if (data.players) setPlayers(data.players);
    });

    socket.on('nextQuestion', ({ index }) => {
      setQuestionCorrectAnswer(null);
      setSelectedAnswer('');
      setCurrentIndex(index);
    });

    socket.on('answerSubmitted', (data) => {
      if (data.questionId) {
        setQuestionResults((prev) => ({
          ...prev,
          [data.questionId]: data.answers || {},
        }));
      }
      if (data.correctAnswer) {
        setQuestionCorrectAnswer(data.correctAnswer);
      }
      if (data.players) {
        setPlayers(data.players);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [code]);

  // Fetch Room Data Logic
  useEffect(() => {
    const fetchRoom = async () => {
      if (!code) return;
      try {
        const response = await roomAPI.join({
          roomCode: code,
          playerId,
          playerName: user?.name || localStorage.getItem('playerName') || 'Player'
        });
        const roomData = response.data?.data;
        if (!roomData) throw new Error('Room not found');

        setRoom(roomData);
        setPlayers(roomData.players || []);

        // Respect server status
        if (roomData.status === 'active') setStarted(true);
        if (roomData.status === 'ended') setQuizEnded(true);

        setRoomLoading(false);
      } catch (error) {
        setRoomError(error.response?.data?.message || 'Invalid or expired room code.');
        setRoomLoading(false);
        setQuizLoading(false); // Stop quiz loading if room fails
      }
    };

    fetchRoom();
  }, [code, playerId, user?.name]);

  // Fetch Quiz Data Logic
  useEffect(() => {
    if (!room?.quizId) return;

    const fetchQuiz = async () => {
      try {
        const response = await quizAPI.getById(room.quizId);
        setQuiz(response.data.data);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        setRoomError('Failed to load quiz content.');
      } finally {
        setQuizLoading(false);
      }
    };

    fetchQuiz();
  }, [room?.quizId]);

  // Loading State
  if (roomLoading || (quizLoading && !roomError)) {
    return <Loading />;
  }

  // Error State
  if (roomError || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="card-solid text-center">
          <p className="text-gray-400">{roomError || 'Invalid or expired room code.'}</p>
          <button onClick={() => navigate('/quiz')} className="btn-primary mt-4">Back to Quiz Hub</button>
        </div>
      </div>
    );
  }

  // Data helpers
  const totalQuestions = quiz?.questions?.length || 0;
  const currentQuestion = quiz?.questions?.[currentIndex];

  // Safe renders
  const currentQuestionId = currentQuestion ? String(currentQuestion.id) : null;
  const currentAnswers = (currentQuestionId && questionResults[currentQuestionId]) || {};
  const hasAnsweredCurrent = Boolean(currentAnswers[playerId]);
  const allPlayersAnswered = players.length > 0 && Object.keys(currentAnswers).length >= players.length;

  const leaderboard = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  const winner = leaderboard[0];

  const handleStart = async () => {
    if (!isHost) return;
    try {
      await roomAPI.updateStatus({ roomCode: code, status: 'active' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirm = async () => {
    if (!selectedAnswer) return;
    if (!started) { console.log('Quiz not started'); return; }
    if (quizEnded) { console.log('Quiz ended'); return; }
    if (hasAnsweredCurrent) { console.log('Already answered'); return; }
    if (!currentQuestionId) { console.log('No question ID'); return; }

    try {
      await roomAPI.submitAnswer({
        roomCode: code,
        questionId: currentQuestionId,
        selectedOption: selectedAnswer,
        playerId,
        playerName: user?.name || localStorage.getItem('playerName') || 'Player'
      });
      setSelectedAnswer('');
    } catch (error) {
      console.error(error);
      alert(
        `Error: ${error.message}\n` +
        (error.response ? JSON.stringify(error.response.data) : 'No response from server (Check network/CORS)')
      );
    }
  };

  const handleNextQuestion = () => {
    if (!isHost || currentIndex >= totalQuestions - 1) return;
    const nextIndex = currentIndex + 1;
    socketRef.current?.emit('nextQuestion', { roomCode: code, index: nextIndex });
    setQuestionCorrectAnswer(null);
    setSelectedAnswer('');
    setCurrentIndex(nextIndex);
  };

  const handleFinishQuiz = async () => {
    if (!isHost) return;
    try {
      await roomAPI.end({ roomCode: code });
    } catch (err) {
      console.error(err);
    }
  };

  // Safe checks for "No Questions" ONLY if we are supposed to be showing them
  if (started && !quizEnded && !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="card-solid text-center">
          <h2 className="text-white text-xl">Quiz Error</h2>
          <p className="text-gray-400">Questions could not be loaded.</p>
          <button onClick={() => navigate('/quiz')} className="btn-primary mt-4">Return</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Room <span className="text-primary-400">{code}</span></h1>
            <p className="text-gray-400 text-sm">Players: {players.length}</p>
          </div>
          {!started && !quizEnded && (
            <button onClick={handleStart} className="btn-primary" disabled={!isHost}>
              {isHost ? 'Start Quiz' : 'Waiting for host'}
            </button>
          )}
        </div>

        {/* Leaderboard Preview (Always visible or toggleable? Requirement says Lobby needs list of players) */}
        <div className="card-solid mb-6">
          <h2 className="text-lg font-semibold text-white mb-2">Players</h2>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {players.map((player) => (
              <div key={player.playerId} className="flex items-center justify-between text-sm text-gray-300">
                <span>{player.name}</span>
                <span>{player.score || 0} XP</span>
              </div>
            ))}
            {players.length === 0 && <p className="text-gray-500 text-sm">Waiting for players...</p>}
          </div>
        </div>

        {/* Dynamic Content */}
        {quizEnded ? (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-2">Quiz complete</h2>
            {winner && (
              <p className="text-gray-300 mb-4">Winner: <span className="text-accent-gold">{winner.name}</span></p>
            )}
            <div className="space-y-2">
              {leaderboard.map((player, index) => (
                <div key={player.playerId} className="flex items-center justify-between text-sm text-gray-300">
                  <span>{index + 1}. {player.name}</span>
                  <span>{player.score || 0} XP</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => navigate('/quiz')} className="btn-secondary">Back to Hub</button>
            </div>
          </div>
        ) : started ? (
          <div className="card">
            <div className="text-sm text-gray-400 mb-2">Question {currentIndex + 1} of {totalQuestions}</div>
            <h2 className="text-xl font-semibold text-white mb-6">{currentQuestion?.questionText}</h2>
            <div className="grid gap-3">
              {currentQuestion?.options && JSON.parse(currentQuestion.options).map((option) => (
                <motion.button
                  key={option}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !hasAnsweredCurrent && setSelectedAnswer(option)}
                  className={`quiz-option ${selectedAnswer === option ? 'selected' : ''}`}
                  disabled={hasAnsweredCurrent}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-100">{option}</span>
                    {selectedAnswer === option && <span className="text-accent-purple">✓</span>}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="btn-primary"
                onClick={handleConfirm}
                disabled={!selectedAnswer || hasAnsweredCurrent}
              >
                {hasAnsweredCurrent ? 'Answer Submitted' : 'Confirm Answer'}
              </button>
            </div>

            {/* Answer feedback / stats */}
            <div className="mt-6 border-t border-dark-700 pt-4">
              <div className="text-sm text-gray-400 mb-2">Live Progress</div>
              <div className="space-y-1">
                {Object.values(currentAnswers).length === 0 && <p className="text-xs text-gray-500">No answers yet.</p>}
                {Object.values(currentAnswers).map((answer) => (
                  <div key={answer.playerId} className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">{answer.name}</span>
                    {/* Only show result if user answered or round ended? Assuming open info for demo/fun */}
                    {questionCorrectAnswer ? (
                      <span className={answer.isCorrect ? 'text-green-400' : 'text-red-400'}>
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    ) : (
                      <span className="text-blue-400">Answered</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Host Controls */}
            {allPlayersAnswered && questionCorrectAnswer && (
              <div className="mt-6 flex items-center justify-between bg-dark-800 p-4 rounded-lg">
                <div className="text-sm text-gray-300">
                  Correct answer: <span className="text-green-400 font-bold">{questionCorrectAnswer}</span>
                </div>
                {currentIndex < totalQuestions - 1 ? (
                  <button className="btn-secondary" onClick={handleNextQuestion} disabled={!isHost}>
                    {isHost ? 'Next Question' : 'Waiting for host...'}
                  </button>
                ) : (
                  <button className="btn-primary" onClick={handleFinishQuiz} disabled={!isHost}>
                    {isHost ? 'Finish Quiz' : 'Waiting for host...'}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="mb-4">
              <div className="animate-pulse inline-block p-3 rounded-full bg-primary-900/50">
                <div className="h-8 w-8 rounded-full bg-primary-500"></div>
              </div>
            </div>
            <h2 className="text-xl text-white font-semibold">Waiting for Host</h2>
            <p className="text-gray-400 mt-2">The quiz will start soon.</p>
          </div>
        )}
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

export default QuizRoom;
