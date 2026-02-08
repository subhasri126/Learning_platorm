import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../../api/course.api';
import { useAuth } from '../../contexts/AuthContext';
import CourseCard from '../../components/course/CourseCard';
import Loading from '../../components/common/Loading';
import MascotGuide from '../../components/learner/MascotGuide';

const CourseList = () => {
  const { isInstructor, isAdmin, isLearner } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log('🔍 Fetching courses...');
      const response = await courseAPI.getAll();
      console.log('📦 API Response:', response);
      console.log('📊 Response data:', response.data);
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      console.log('✅ Courses array:', data);
      console.log('📈 Number of courses:', data.length);
      setAllCourses(data);
    } catch (err) {
      console.error('❌ Error fetching courses:', err);
      console.error('❌ Error response:', err.response);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const getDifficulty = (course) => {
    const lessons = course._count?.lessons || 0;
    if (lessons <= 5) return { label: 'Beginner', color: 'bg-green-500/20 text-green-300' };
    if (lessons <= 10) return { label: 'Intermediate', color: 'bg-yellow-500/20 text-yellow-300' };
    return { label: 'Advanced', color: 'bg-red-500/20 text-red-300' };
  };

  const getEstimatedTime = (course) => {
    const lessons = course._count?.lessons || 1;
    return `${Math.max(1, lessons) * 15} min`;
  };

  const getXpPreview = (course) => {
    const lessons = course._count?.lessons || 0;
    const quizzes = course._count?.quizzes || 0;
    return lessons * 20 + quizzes * 50;
  };

  const getStatus = (course) => {
    const progress = course.progress ?? course.userProgress ?? 0;
    if (progress >= 100) return 'Completed';
    if (progress > 0) return 'Continue';
    return 'Start';
  };

  const getCategoryTags = (course) => {
    const title = (course.title || '').toLowerCase();
    const description = (course.description || '').toLowerCase();
    const text = `${title} ${description}`;
    const tags = [];

    if (text.includes('javascript') || text.includes('js')) tags.push('JavaScript', 'Programming');
    if (text.includes('python')) tags.push('Python', 'Programming');
    if (text.includes('java')) tags.push('Java', 'Programming');
    if (text.includes('frontend') || text.includes('front-end') || text.includes('react')) tags.push('Frontend', 'Web Development');
    if (text.includes('backend') || text.includes('back-end') || text.includes('node')) tags.push('Backend', 'Web Development');
    if (text.includes('full stack') || text.includes('fullstack')) tags.push('Full Stack', 'Web Development');
    if (text.includes('mysql')) tags.push('MySQL', 'Databases');
    if (text.includes('postgres')) tags.push('PostgreSQL', 'Databases');
    if (text.includes('database') && !tags.includes('Databases')) tags.push('Databases');
    if (text.includes('computer fundamentals') || text.includes('fundamentals')) tags.push('Computer Fundamentals');

    if (!tags.length) {
      tags.push('Computer Fundamentals');
    }

    return [...new Set(tags)];
  };

  const getCourseMeta = (course) => {
    const difficulty = getDifficulty(course).label;
    const duration = getEstimatedTime(course);
    const xpPreview = getXpPreview(course);
    const status = getStatus(course);
    const tags = getCategoryTags(course);
    return { difficulty, duration, xpPreview, status, tags };
  };

  const curatedCourses = [
    {
      id: 'curated-js-basics',
      title: 'JavaScript Basics',
      description: 'Learn variables, functions, and DOM essentials.',
      isPublished: true,
      instructor: { name: 'LearnSphere' },
      _count: { lessons: 6, quizzes: 2 },
      userProgress: 0
    },
    {
      id: 'curated-js-advanced',
      title: 'Advanced JavaScript',
      description: 'Closures, async patterns, and performance tips.',
      isPublished: true,
      instructor: { name: 'LearnSphere' },
      _count: { lessons: 11, quizzes: 3 },
      userProgress: 0
    },
    {
      id: 'curated-python-fundamentals',
      title: 'Python Fundamentals',
      description: 'Write clean Python code for automation and data tasks.',
      isPublished: true,
      instructor: { name: 'LearnSphere' },
      _count: { lessons: 8, quizzes: 2 },
      userProgress: 0
    },
    {
      id: 'curated-web-frontend',
      title: 'Web Development – Frontend',
      description: 'HTML, CSS, and responsive UI foundations.',
      isPublished: true,
      instructor: { name: 'LearnSphere' },
      _count: { lessons: 10, quizzes: 2 },
      userProgress: 0
    },
    {
      id: 'curated-web-backend',
      title: 'Web Development – Backend',
      description: 'Build APIs, handle auth, and connect databases.',
      isPublished: true,
      instructor: { name: 'LearnSphere' },
      _count: { lessons: 9, quizzes: 2 },
      userProgress: 0
    },
    {
      id: 'curated-fullstack',
      title: 'Full Stack Development',
      description: 'Ship complete apps with frontend + backend workflows.',
      isPublished: true,
      instructor: { name: 'LearnSphere' },
      _count: { lessons: 12, quizzes: 3 },
      userProgress: 0
    },
    {
      id: 'curated-mysql',
      title: 'MySQL & Databases',
      description: 'Queries, joins, and schema design essentials.',
      isPublished: true,
      instructor: { name: 'LearnSphere' },
      _count: { lessons: 7, quizzes: 2 },
      userProgress: 0
    },
    {
      id: 'curated-fundamentals',
      title: 'Computer Fundamentals',
      description: 'Understand OS, memory, files, and networking basics.',
      isPublished: true,
      instructor: { name: 'LearnSphere' },
      _count: { lessons: 5, quizzes: 1 },
      userProgress: 0
    },
    {
      id: 'curated-data-structures',
      title: 'Data Structures Basics',
      description: 'Arrays, stacks, queues, and linked lists explained.',
      isPublished: true,
      instructor: { name: 'LearnSphere' },
      _count: { lessons: 9, quizzes: 2 },
      userProgress: 0
    },
    {
      id: 'curated-logic',
      title: 'Programming Logic & Problem Solving',
      description: 'Build reasoning skills with step-by-step challenges.',
      isPublished: true,
      instructor: { name: 'LearnSphere' },
      _count: { lessons: 6, quizzes: 2 },
      userProgress: 0
    }
  ];

  const expandedCourses = useMemo(() => {
    console.log('🔄 Computing expandedCourses...');
    console.log('   isLearner:', isLearner);
    console.log('   allCourses.length:', allCourses.length);

    if (!isLearner) {
      console.log('   → Returning allCourses (not a learner)');
      return allCourses;
    }

    if (allCourses.length >= 8) {
      console.log('   → Returning allCourses (>= 8 courses)');
      return allCourses;
    }

    const existingTitles = new Set(allCourses.map((course) => course.title));
    const missing = curatedCourses.filter((course) => !existingTitles.has(course.title));
    console.log('   → Adding', missing.length, 'curated courses');
    console.log('   → Total courses:', allCourses.length + missing.length);
    return [...allCourses, ...missing];
  }, [allCourses, isLearner]);

  const decoratedCourses = useMemo(() =>
    expandedCourses.map((course) => ({
      ...course,
      meta: getCourseMeta(course)
    })),
    [expandedCourses]
  );

  useEffect(() => {
    console.log('🔍 Filtering courses...');
    console.log('   searchTerm:', searchTerm);
    console.log('   decoratedCourses.length:', decoratedCourses.length);

    if (!searchTerm.trim()) {
      console.log('   → No search term, showing all decorated courses');
      setFilteredCourses(decoratedCourses);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = decoratedCourses.filter((course) => {
      const title = (course.title || '').toLowerCase();
      const description = (course.description || '').toLowerCase();
      const text = `${title} ${description}`;
      const tags = (course.meta?.tags || []).join(' ').toLowerCase();
      const difficulty = (course.meta?.difficulty || '').toLowerCase();
      return text.includes(term) || tags.includes(term) || difficulty.includes(term);
    });

    console.log('   → Filtered to', filtered.length, 'courses');
    setFilteredCourses(filtered);
  }, [decoratedCourses, searchTerm]);

  const featuredCourses = useMemo(() => filteredCourses.slice(0, 3), [filteredCourses]);
  const newCourses = useMemo(() => filteredCourses.slice(0, 6), [filteredCourses]);
  const popularCourses = useMemo(() =>
    [...filteredCourses]
      .sort((a, b) => ((b._count?.lessons || 0) + (b._count?.quizzes || 0)) - ((a._count?.lessons || 0) + (a._count?.quizzes || 0)))
      .slice(0, 6),
    [filteredCourses]
  );

  const recommendedCourses = useMemo(() =>
    [...filteredCourses]
      .sort((a, b) => (a.meta.difficulty > b.meta.difficulty ? 1 : -1))
      .slice(0, 6),
    [filteredCourses]
  );

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">All Courses</h1>
          <p className="text-gray-400 mt-1">Explore and learn from our curated courses</p>
        </div>
        <div className="w-full lg:w-96">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search courses by title, tag, category, or level..."
            className="input-field"
          />
          {searchTerm.trim() && (
            <p className="text-xs text-gray-400 mt-2">🔍 Showing results for ‘{searchTerm}’</p>
          )}
        </div>
        {(isInstructor || isAdmin) && (
          <Link to="/courses/create" className="btn-primary">
            + Create Course
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {filteredCourses.length > 0 ? (
        <div className="space-y-10">
          {isLearner && (
            <div className="card-solid">
              <MascotGuide
                inline
                emoji="📚"
                message="Not sure what to learn next? Try one of these!"
              />
            </div>
          )}

          {isLearner && featuredCourses.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">✨ Featured Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((course) => {
                  const difficulty = getDifficulty(course);
                  return (
                    <Link key={course.id} to={`/courses/${course.id}`} className="card-hover block">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs ${difficulty.color}`}>{difficulty.label}</span>
                        <span className="text-sm text-gray-400">⚡ {getXpPreview(course)} XP</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{course.meta.status}</div>
                      <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {course.description || 'Build a skill you can use today.'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>⏱️ {getEstimatedTime(course)}</span>
                        <span>📘 {course._count?.lessons || 0} lessons</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
                        {course.meta.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 rounded-full bg-dark-700/70">{tag}</span>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <span className="btn-primary text-xs px-4 py-2">{course.meta.status}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {isLearner && newCourses.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">🆕 New Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newCourses.map((course) => {
                  const difficulty = getDifficulty(course);
                  return (
                    <Link key={course.id} to={`/courses/${course.id}`} className="card-hover block">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs ${difficulty.color}`}>{difficulty.label}</span>
                        <span className="text-sm text-gray-400">⚡ {getXpPreview(course)} XP</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{course.meta.status}</div>
                      <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {course.description || 'Get started with a fresh new topic.'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>⏱️ {getEstimatedTime(course)}</span>
                        <span>📘 {course._count?.lessons || 0} lessons</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
                        {course.meta.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 rounded-full bg-dark-700/70">{tag}</span>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <span className="btn-primary text-xs px-4 py-2">{course.meta.status}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {isLearner && popularCourses.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">🔥 Popular Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularCourses.map((course) => {
                  const difficulty = getDifficulty(course);
                  return (
                    <Link key={course.id} to={`/courses/${course.id}`} className="card-hover block">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs ${difficulty.color}`}>{difficulty.label}</span>
                        <span className="text-sm text-gray-400">⚡ {getXpPreview(course)} XP</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{course.meta.status}</div>
                      <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {course.description || 'Loved by learners like you.'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>⏱️ {getEstimatedTime(course)}</span>
                        <span>📘 {course._count?.lessons || 0} lessons</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
                        {course.meta.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 rounded-full bg-dark-700/70">{tag}</span>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <span className="btn-primary text-xs px-4 py-2">{course.meta.status}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {isLearner && recommendedCourses.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">🎯 Recommended for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCourses.map((course) => {
                  const difficulty = getDifficulty(course);
                  return (
                    <Link key={course.id} to={`/courses/${course.id}`} className="card-hover block">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs ${difficulty.color}`}>{difficulty.label}</span>
                        <span className="text-sm text-gray-400">⚡ {getXpPreview(course)} XP</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{course.meta.status}</div>
                      <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {course.description || 'Hand-picked to match your growth.'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>⏱️ {getEstimatedTime(course)}</span>
                        <span>📘 {course._count?.lessons || 0} lessons</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
                        {course.meta.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 rounded-full bg-dark-700/70">{tag}</span>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <span className="btn-primary text-xs px-4 py-2">{course.meta.status}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">All Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  meta={course.meta}
                  isInstructor={isInstructor || isAdmin}
                />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="text-center py-12">
          {allCourses.length > 0 ? (
            <p className="text-gray-400 text-lg">No courses found.</p>
          ) : (
            <p className="text-gray-400 text-lg">No courses available yet.</p>
          )}
          {(isInstructor || isAdmin) && allCourses.length === 0 && (
            <Link to="/courses/create" className="btn-primary mt-4 inline-block">
              Create Your First Course
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseList;
