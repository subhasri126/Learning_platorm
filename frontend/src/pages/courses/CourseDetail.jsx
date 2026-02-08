import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseAPI } from '../../api/course.api';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';
import ProgressBar from '../../components/progress/ProgressBar';
import MascotGuide from '../../components/learner/MascotGuide';
import { doubtAPI } from '../../api/doubt.api';
import { motion, AnimatePresence } from 'framer-motion';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, isLearner, isInstructor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNudge, setShowNudge] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showSendOption, setShowSendOption] = useState(false);
  const questionRef = useRef(null);

  useEffect(() => {
    fetchCourse();
    if (isLearner) {
      fetchProgress();
    }
  }, [id, isLearner]);

  const fetchCourse = async () => {
    const curatedCourses = {
      'curated-js-basics': {
        id: 'curated-js-basics',
        title: 'JavaScript Basics',
        description: 'Learn variables, functions, and DOM essentials.',
        instructor: { name: 'LearnSphere' },
        isPublished: true,
        lessons: [
          { id: 'l1', title: 'Variables & Data Types', type: 'video', duration: 12 },
          { id: 'l2', title: 'Functions & Scope', type: 'document', duration: 18 },
          { id: 'l3', title: 'DOM Basics', type: 'video', duration: 15 }
        ],
        quizzes: []
      },
      'curated-js-advanced': {
        id: 'curated-js-advanced',
        title: 'Advanced JavaScript',
        description: 'Closures, async patterns, and performance tips.',
        instructor: { name: 'LearnSphere' },
        isPublished: true,
        lessons: [
          { id: 'l1', title: 'Closures Deep Dive', type: 'video', duration: 20 },
          { id: 'l2', title: 'Async/Await Patterns', type: 'document', duration: 16 },
          { id: 'l3', title: 'Performance', type: 'video', duration: 14 }
        ],
        quizzes: []
      },
      'curated-python-fundamentals': {
        id: 'curated-python-fundamentals',
        title: 'Python Fundamentals',
        description: 'Write clean Python code for automation and data tasks.',
        instructor: { name: 'LearnSphere' },
        isPublished: true,
        lessons: [
          { id: 'l1', title: 'Python Syntax', type: 'video', duration: 14 },
          { id: 'l2', title: 'Collections', type: 'document', duration: 18 },
          { id: 'l3', title: 'Automation Basics', type: 'video', duration: 16 }
        ],
        quizzes: []
      },
      'curated-web-frontend': {
        id: 'curated-web-frontend',
        title: 'Web Development – Frontend',
        description: 'HTML, CSS, and responsive UI foundations.',
        instructor: { name: 'LearnSphere' },
        isPublished: true,
        lessons: [
          { id: 'l1', title: 'HTML Structure', type: 'document', duration: 12 },
          { id: 'l2', title: 'CSS Layouts', type: 'video', duration: 20 },
          { id: 'l3', title: 'Responsive Design', type: 'video', duration: 18 }
        ],
        quizzes: []
      },
      'curated-web-backend': {
        id: 'curated-web-backend',
        title: 'Web Development – Backend',
        description: 'Build APIs, handle auth, and connect databases.',
        instructor: { name: 'LearnSphere' },
        isPublished: true,
        lessons: [
          { id: 'l1', title: 'REST APIs', type: 'video', duration: 15 },
          { id: 'l2', title: 'Auth Basics', type: 'document', duration: 12 },
          { id: 'l3', title: 'Database Access', type: 'video', duration: 18 }
        ],
        quizzes: []
      },
      'curated-fullstack': {
        id: 'curated-fullstack',
        title: 'Full Stack Development',
        description: 'Ship complete apps with frontend + backend workflows.',
        instructor: { name: 'LearnSphere' },
        isPublished: true,
        lessons: [
          { id: 'l1', title: 'Architecture Overview', type: 'document', duration: 14 },
          { id: 'l2', title: 'Frontend Integration', type: 'video', duration: 18 },
          { id: 'l3', title: 'Backend Integration', type: 'video', duration: 18 }
        ],
        quizzes: []
      },
      'curated-mysql': {
        id: 'curated-mysql',
        title: 'MySQL & Databases',
        description: 'Queries, joins, and schema design essentials.',
        instructor: { name: 'LearnSphere' },
        isPublished: true,
        lessons: [
          { id: 'l1', title: 'SQL Basics', type: 'document', duration: 12 },
          { id: 'l2', title: 'Joins', type: 'video', duration: 16 },
          { id: 'l3', title: 'Indexes', type: 'video', duration: 14 }
        ],
        quizzes: []
      },
      'curated-fundamentals': {
        id: 'curated-fundamentals',
        title: 'Computer Fundamentals',
        description: 'Understand OS, memory, files, and networking basics.',
        instructor: { name: 'LearnSphere' },
        isPublished: true,
        lessons: [
          { id: 'l1', title: 'Operating Systems', type: 'document', duration: 10 },
          { id: 'l2', title: 'Memory & Storage', type: 'video', duration: 12 },
          { id: 'l3', title: 'Networking Basics', type: 'video', duration: 14 }
        ],
        quizzes: []
      },
      'curated-data-structures': {
        id: 'curated-data-structures',
        title: 'Data Structures Basics',
        description: 'Arrays, stacks, queues, and linked lists explained.',
        instructor: { name: 'LearnSphere' },
        isPublished: true,
        lessons: [
          { id: 'l1', title: 'Arrays', type: 'document', duration: 12 },
          { id: 'l2', title: 'Stacks & Queues', type: 'video', duration: 16 },
          { id: 'l3', title: 'Linked Lists', type: 'video', duration: 14 }
        ],
        quizzes: []
      },
      'curated-logic': {
        id: 'curated-logic',
        title: 'Programming Logic & Problem Solving',
        description: 'Build reasoning skills with step-by-step challenges.',
        instructor: { name: 'LearnSphere' },
        isPublished: true,
        lessons: [
          { id: 'l1', title: 'Thinking in Steps', type: 'document', duration: 10 },
          { id: 'l2', title: 'Patterns', type: 'video', duration: 14 },
          { id: 'l3', title: 'Practice Challenges', type: 'video', duration: 16 }
        ],
        quizzes: []
      }
    };

    if (Number.isNaN(Number(id))) {
      const localCourse = curatedCourses[id];
      if (localCourse) {
        setCourse(localCourse);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await courseAPI.getById(id);
      setCourse(response.data.data);
    } catch (err) {
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await courseAPI.getProgress(id);
      setProgress(response.data.data);
    } catch (err) {
      console.log('No progress yet');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollCount((prev) => {
        const next = prev + 1;
        if (next > 6) setShowNudge(true);
        return next;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await courseAPI.delete(id);
      navigate('/courses');
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  // All hooks MUST be before early returns
  const skills = useMemo(() => {
    if (!course) return [];
    const title = course.title.toLowerCase();
    if (title.includes('javascript')) return ['ES6+', 'DOM', 'Async Patterns'];
    if (title.includes('python')) return ['Syntax', 'Automation', 'Data Handling'];
    if (title.includes('backend')) return ['APIs', 'Auth', 'Databases'];
    if (title.includes('frontend')) return ['HTML/CSS', 'Components', 'UX'];
    if (title.includes('database') || title.includes('mysql')) return ['SQL', 'Schemas', 'Indexes'];
    return ['Core Concepts', 'Best Practices', 'Problem Solving'];
  }, [course]);

  // Move groupedLessons inside the component before return
  const groupedLessons = useMemo(() => {
    if (!course?.lessons) return {};
    const groups = {};
    course.lessons.forEach(lesson => {
      const unit = lesson.unitTitle || 'Introduction & Basics';
      if (!groups[unit]) groups[unit] = [];
      groups[unit].push(lesson);
    });
    return groups;
  }, [course]);

  // Early returns AFTER all hooks
  if (loading) return <Loading />;
  if (!course) return <div className="text-center py-12">Course not found</div>;

  console.log('🔍 CourseDetail Debug:');
  console.log('  User:', user);
  console.log('  isAdmin:', isAdmin);
  console.log('  isInstructor:', isInstructor);
  console.log('  isLearner:', isLearner);
  console.log('  Course ID:', course.id);
  console.log('  Course Instructor ID:', course.instructor?.id);
  console.log('  User ID:', user?.id);

  const canEdit = isAdmin || (isInstructor && course.instructor?.id == user?.id);
  console.log('  canEdit:', canEdit);
  console.log('  Reason:', isAdmin ? 'User is Admin' : (isInstructor && course.instructor?.id == user?.id) ? 'User is course instructor' : 'No edit permission');

  const totalLessons = course.lessons?.length || 0;
  const totalQuizzes = course.quizzes?.length || 0;
  const estimatedMinutes = totalLessons * 15;
  // skills moved above early returns

  const handleAsk = () => {
    if (!question.trim()) return;
    const q = question.toLowerCase();
    if (q.includes('closure')) {
      setAnswer('A closure lets a function access variables from its outer scope, even after that scope has returned.');
      setShowSendOption(false);
      return;
    }
    if (q.includes('async') || q.includes('await')) {
      setAnswer('Async/await helps you write asynchronous code in a readable, sequential style while still using promises.');
      setShowSendOption(false);
      return;
    }
    if (q.includes('sql') || q.includes('query')) {
      setAnswer('SQL lets you retrieve and manipulate structured data using SELECT, INSERT, UPDATE, and JOIN statements.');
      setShowSendOption(false);
      return;
    }

    setAnswer("I couldn't find a clear answer in this course content.");
    setShowSendOption(true);
  };

  const handleSendToInstructor = async () => {
    try {
      await doubtAPI.create(course.id, question);
      setAnswer('Sent to your instructor. You will receive a reply soon.');
      setShowSendOption(false);
    } catch (error) {
      setAnswer('Failed to send. Please try again in a moment.');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 animate-slide-up">
            <span className="text-xl">⚠️</span>
            {error}
          </div>
        )}

        {/* 🚀 COURSE HERO SECTION */}
        <div className="card-gradient mb-10 overflow-hidden relative border-none shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-500/10 to-transparent pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start relative z-10">
            {course.thumbnail && (
              <div className="w-full lg:w-80 flex-shrink-0">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full aspect-video lg:aspect-square object-cover rounded-2xl shadow-glow brightness-90 hover:brightness-100 transition-all duration-500"
                />
              </div>
            )}

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                {!course.isPublished && (
                  <span className="badge badge-silver">Draft Mode</span>
                )}
                <span className="badge badge-info flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  {totalLessons} Lessons
                </span>
                <span className="badge badge-level">Professional Curriculum</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                {course.title}
              </h1>

              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8 font-light leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center font-bold text-primary-400 border border-dark-600">
                    {course.instructor?.name?.[0] || 'L'}
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs uppercase font-bold tracking-wider">Instructor</div>
                    <div className="text-white font-medium">{course.instructor?.name || 'Lead Instructor'}</div>
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-dark-700/50 hidden md:block" />

              <div>
                <div className="text-gray-500 text-xs uppercase font-bold tracking-wider">Estimated Time</div>
                <div className="text-white font-medium">{estimatedMinutes} Minutes</div>
              </div>

              <div className="h-8 w-px bg-dark-700/50 hidden md:block" />

              {canEdit && (
                <div className="flex gap-2">
                  <Link to={`/courses/${id}/edit`} className="btn-secondary py-2 px-5 text-sm">
                    Edit Content
                  </Link>
                  <button onClick={handleDelete} className="btn-danger py-2 px-5 text-sm">
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-dark-700/50">
          <div className="p-4 rounded-xl bg-dark-900/40 border border-dark-700/30 text-center">
            <div className="text-2xl font-bold text-white mb-1">{totalLessons}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Modules</div>
          </div>
          <div className="p-4 rounded-xl bg-dark-900/40 border border-dark-700/30 text-center">
            <div className="text-2xl font-bold text-white mb-1">{totalQuizzes}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Quizzes</div>
          </div>
          <div className="p-4 rounded-xl bg-dark-900/40 border border-dark-700/30 text-center">
            <div className="text-2xl font-bold text-white mb-1">{estimatedMinutes}m</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Total Run</div>
          </div>
          <div className="p-4 rounded-xl bg-dark-900/40 border border-dark-700/30 text-center overflow-hidden">
            <div className="text-xs font-bold text-white mb-1 truncate">{skills[0]}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Key Skill</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          {/* 📚 UNIT-BASED CURRICULUM */}
          <div className="lg:col-span-8 space-y-10">
            {progress && (
              <div className="card-solid p-8 border-primary-500/20 shadow-glow-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Your Learning Mastery</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Keep going! You have completed {progress.completedLessons} modules out of {progress.totalLessons}.
                    </p>
                  </div>
                  <div className="text-3xl font-black text-primary-400">{progress.progressPercentage}%</div>
                </div>
                <div className="xp-bar h-4 border border-dark-600 p-0.5">
                  <div
                    className="xp-fill h-full rounded-full"
                    style={{ width: `${progress.progressPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                Course Curriculum
                <span className="text-sm font-normal text-gray-500 bg-dark-800 px-3 py-1 rounded-full">{totalLessons} Parts</span>
              </h2>
              {canEdit && (
                <Link to={`/courses/${id}/lessons/create`} className="btn-primary py-2 px-6 shadow-glow text-sm">
                  + New Module
                </Link>
              )}
            </div>

            {Object.keys(groupedLessons).length > 0 ? (
              <div className="space-y-12">
                {Object.entries(groupedLessons).map(([unit, lessons], uIdx) => (
                  <div key={unit} className="relative">
                    <div className="flex items-center gap-4 mb-6 sticky top-24 z-10 bg-dark-900/95 py-2 backdrop-blur-md">
                      <div className="w-10 h-10 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center font-black text-lg border border-primary-500/30">
                        {uIdx + 1}
                      </div>
                      <h3 className="text-2xl font-bold text-white tracking-wide">{unit}</h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-dark-700 to-transparent" />
                    </div>

                    <div className="grid gap-3 pl-4 border-l-2 border-dark-800 ml-5">
                      {lessons.map((lesson, index) => (
                        <div key={lesson.id} className="group relative">
                          <div className="absolute -left-[2.2rem] top-1/2 -translate-y-1/2 w-4 h-[2px] bg-dark-800 group-hover:bg-primary-500 transition-colors" />
                          <div className="card bg-dark-800/40 hover:bg-dark-800 border-dark-700/50 hover:border-primary-500/30 p-5 group flex items-center justify-between gap-6 transition-all duration-300">
                            <div className="flex items-center gap-5 flex-1 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-dark-900 flex flex-col items-center justify-center flex-shrink-0 border border-dark-700 group-hover:border-primary-500/30 transition-colors">
                                <span className="text-[10px] uppercase font-black text-gray-500 group-hover:text-primary-400">{lesson.type}</span>
                                <div className="text-lg font-black text-white">{index + 1}</div>
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-lg font-bold text-gray-100 group-hover:text-white transition-colors truncate">{lesson.title}</h4>
                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-medium">
                                  <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="text-primary-400">⏱</span> {lesson.duration || 10} min</span>
                                  {lesson.description && <span className="truncate hidden sm:block opacity-60">• {lesson.description}</span>}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {canEdit ? (
                                <Link
                                  to={`/courses/${id}/lessons/${lesson.id}/edit`}
                                  className="p-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white transition-all border border-dark-600"
                                  title="Edit Module"
                                >
                                  ⚙️
                                </Link>
                              ) : null}
                              <Link
                                to={`/lessons/${lesson.id}`}
                                className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 group-hover:shadow-glow shadow-none"
                              >
                                Start <span className="hidden sm:inline">Learning</span> →
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-solid text-center py-20 px-10 border-dashed border-2 border-dark-700 bg-transparent">
                <div className="text-6xl mb-6 opacity-30">📚</div>
                <h3 className="text-2xl font-bold text-white mb-2">Knowledge Foundation Empty</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-8">This course curriculum is currently being developed. Check back soon for the first modules!</p>
                {canEdit && (
                  <Link to={`/courses/${id}/lessons/create`} className="btn-primary px-10">Initialize First Module</Link>
                )}
              </div>
            )}
          </div>

          {/* ⚡ INTERACTIVE SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              {/* Quizzes Section */}
              <div className="card border-accent-purple/20 bg-gradient-to-br from-dark-800/80 to-dark-900/80">
                <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="text-accent-purple">🎮</span> Skill Challenges
                </h2>
                {course.quizzes && course.quizzes.length > 0 ? (
                  <div className="space-y-4">
                    {course.quizzes.map((quiz) => (
                      <Link
                        key={quiz.id}
                        to={`/quiz/${quiz.id}`}
                        className="group block card-solid p-5 bg-dark-900/50 border-dark-700 hover:border-accent-purple/50 transition-all hover:-translate-y-1"
                      >
                        <h3 className="font-bold text-gray-100 group-hover:text-white mb-2">{quiz.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                            {quiz._count?.questions || 0} Questions
                          </span>
                          <span className="px-3 py-1 bg-accent-purple/20 text-accent-purple text-[10px] font-bold rounded-lg border border-accent-purple/30">
                            {quiz.maxPoints} XP
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dark-700 rounded-2xl border-dashed">
                    <p className="text-gray-500 text-sm">No adaptive quizzes found.</p>
                  </div>
                )}
              </div>

              {/* AI Solving Box */}
              <div className="card relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-500 via-accent-purple to-accent-pink" />
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <span className="animate-pulse">✨</span> AI Knowledge Assistant
                </h2>
                <p className="text-sm text-gray-400 mb-6 font-medium">Instantly analyze course concepts or ask technical clarifications.</p>
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      ref={questionRef}
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      className="input-field min-h-[140px] bg-dark-900 border-dark-700 focus:border-primary-500/50 resize-none text-[15px]"
                      placeholder="e.g. Can you explain the difference between VAR and LET in this context?"
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] font-black text-dark-600 uppercase tracking-tighter">Enter to Process</div>
                  </div>
                  <button
                    onClick={handleAsk}
                    className="btn-primary w-full py-3.5 shadow-glow-lg flex items-center justify-center gap-2"
                  >
                    Analyze Inquiry 🚀
                  </button>

                  <AnimatePresence>
                    {answer && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary-500/5 border border-primary-500/20 rounded-2xl p-5 text-[14px] text-gray-300 leading-relaxed shadow-inner"
                      >
                        <div className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
                          Insights Generated
                        </div>
                        {answer}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {showSendOption && (
                    <button
                      onClick={handleSendToInstructor}
                      className="btn-secondary w-full py-3 border-dashed border-gray-600 text-sm"
                    >
                      Connect with Human Instructor
                    </button>
                  )}
                </div>
              </div>

              {/* Instructor Card */}
              <div className="card-solid bg-transparent border-dark-700/50 flex flex-col items-center p-8 text-center group">
                <div className="w-20 h-20 rounded-3xl bg-dark-800 border-2 border-dark-700 mb-6 flex items-center justify-center text-4xl group-hover:border-primary-500/50 transition-colors shadow-2xl">
                  👨‍🏫
                </div>
                <div className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] mb-1">Pedagogical Lead</div>
                <h4 className="text-2xl font-black text-white mb-2 tracking-tight">{course.instructor?.name || 'Expert Educator'}</h4>
                <p className="text-sm text-gray-400 mb-8 font-light">Dedicated to providing step-by-step guidance for complex technical domains.</p>
                <button className="btn-secondary w-full text-sm py-2.5">Follow Portfolio</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNudge && isLearner && (
        <MascotGuide emoji="🎯" message="Ready to master the next module?" position="bottom-right" />
      )}
    </div>
  );
};

export default CourseDetail;
