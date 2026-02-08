import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { lessonAPI } from '../../api/lesson.api';
import { progressAPI } from '../../api/progress.api';
import { ArrowLeft, BookOpen, Menu, ChevronRight, CheckCircle } from 'lucide-react';
import Loading from '../../components/common/Loading';

const LessonView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  
  const videoRef = useRef(null);
  const readTimeoutRef = useRef(null);
  const hasTrackedProgress = useRef(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await lessonAPI.getById(id);
        const lessonData = response.data.data;
        console.log('📚 Lesson loaded:', lessonData);
        
        // Check if lesson has progress records and is completed
        const alreadyCompleted = lessonData.progress && lessonData.progress.length > 0 && lessonData.progress[0].isCompleted;
        console.log('✅ Already completed?', alreadyCompleted);
        
        setLesson(lessonData);
        setIsCompleted(alreadyCompleted);
        hasTrackedProgress.current = alreadyCompleted;
      } catch (err) {
        console.error('❌ Failed to load lesson:', err);
        setError('Failed to load lesson content.');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
    
    return () => {
      if (readTimeoutRef.current) {
        clearTimeout(readTimeoutRef.current);
      }
    };
  }, [id]);

  // Auto-track progress for video content (80% watched)
  useEffect(() => {
    if (!lesson || hasTrackedProgress.current || isCompleted) {
      console.log('⏭️ Skipping video tracking:', { hasLesson: !!lesson, hasTracked: hasTrackedProgress.current, isCompleted });
      return;
    }

    if (lesson.type === 'VIDEO' && videoRef.current) {
      const video = videoRef.current;
      console.log('🎥 Setting up video tracking for:', video.tagName);

      const handleTimeUpdate = () => {
        if (!video.duration) return;
        const watchedPercentage = (video.currentTime / video.duration) * 100;
        console.log('⏱️ Video progress:', watchedPercentage.toFixed(2) + '%');
        
        if (watchedPercentage >= 80) {
          console.log('🎯 80% threshold reached! Enabling complete button...');
          setCanComplete(true);
          if (!hasTrackedProgress.current) {
            hasTrackedProgress.current = true;
            markAsComplete();
          }
        }
      };

      const handleLoadedMetadata = () => {
        console.log('📊 Video metadata loaded. Duration:', video.duration, 'seconds');
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    } else if (lesson.type === 'VIDEO' && lesson.content.includes('youtube')) {
      console.log('⚠️ YouTube video detected - auto-tracking not supported. Please use manual complete button.');
    }
  }, [lesson, isCompleted]);

  // Auto-track progress for text/PDF content (30 seconds)
  useEffect(() => {
    if (!lesson || hasTrackedProgress.current || isCompleted) {
      console.log('⏭️ Skipping text tracking:', { hasLesson: !!lesson, hasTracked: hasTrackedProgress.current, isCompleted });
      return;
    }

    if (lesson.type === 'DOCUMENT' || lesson.type === 'PDF' || lesson.type === 'IMAGE') {
      console.log('⏳ Starting 30-second timer for', lesson.type, 'content');
      // Enable button immediately for non-video content
      setCanComplete(true);
      
      readTimeoutRef.current = setTimeout(() => {
        if (!hasTrackedProgress.current) {
          console.log('⏰ 30 seconds elapsed! Marking complete...');
          hasTrackedProgress.current = true;
          markAsComplete();
        }
      }, 30000); // 30 seconds

      return () => {
        if (readTimeoutRef.current) {
          console.log('🧹 Clearing read timeout');
          clearTimeout(readTimeoutRef.current);
        }
      };
    }
  }, [lesson, isCompleted]);

  const markAsComplete = async () => {
    try {
      console.log('💾 Marking lesson complete:', id);
      setCompleting(true);
      const response = await progressAPI.markLessonComplete(id);
      console.log('✅ Marked complete successfully:', response.data);
      setIsCompleted(true);
    } catch (err) {
      console.error('❌ Failed to mark lesson as complete:', err);
      console.error('Error details:', err.response?.data || err.message);
      hasTrackedProgress.current = false;
      alert('Failed to save progress: ' + (err.response?.data?.message || err.message));
    } finally {
      setCompleting(false);
    }
  };

  const handleManualComplete = async () => {
    if (hasTrackedProgress.current || isCompleted) return;
    hasTrackedProgress.current = true;
    await markAsComplete();
  };

  const scrollToSection = (index) => {
    setActiveSection(index);
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-400">
      {error}
      <button onClick={() => navigate('/courses')} className="ml-4 btn-primary">Back to Courses</button>
    </div>
  );
  if (!lesson) return null;

  const isPdfLesson = lesson.type === 'PDF' || (lesson.type === 'DOCUMENT' && lesson.structuredContent);
  const rawStructuredContent = lesson.structuredContent || {};

  // 1. Get raw sections from backend (could be Extracted, OCR, or AI Generated)
  let rawSections = rawStructuredContent.sections || (Array.isArray(rawStructuredContent) ? rawStructuredContent : []);

  // 2. STRICT FILTER: Remove any backend-generated error messages
  // This protects against legacy data in the DB
  rawSections = rawSections.filter(s =>
    !s.heading?.includes("Conversion Issue") &&
    !s.content?.includes("Unable to extract text")
  );

  let sections = [];

  // 3. PRIORITY RESOLUTION
  if (rawStructuredContent.source === 'ai') {
    // Priority 1: AI Generated Content (Antigravity Fallback)
    sections = rawSections;
  } else if (rawStructuredContent.manualContent && rawStructuredContent.manualContent.trim().length > 0) {
    // Priority 2: Manual Content (Instructor)
    sections = [{
      heading: "Instructor Notes",
      content: rawStructuredContent.manualContent.split('\n'),
      type: 'text'
    }];
  } else if (rawSections.length > 0) {
    // Priority 3: Extracted Content
    sections = rawSections;
  } else {
    // 4. FINAL FALLBACK (Friendly Message)
    // Never show empty screen or technical error
    sections = [{
      heading: "Lesson Content",
      content: "Lesson content is being prepared. You can continue learning.",
      type: 'text'
    }];
  }

  const courseId = lesson.courseId;

  // Fallback for non-PDF or unprocessed PDF
  if (!isPdfLesson || !sections || !Array.isArray(sections)) {
    return (
      <div className="min-h-screen bg-dark-900 text-white p-8">
        <Link to={`/courses/${courseId}`} className="flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Course
        </Link>
        <div className="card max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold flex-1">{lesson.title}</h1>
            {isCompleted && (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl font-bold text-sm">
                <CheckCircle className="w-5 h-5" />
                <span>Completed</span>
              </div>
            )}
          </div>
          <div className="prose prose-invert max-w-none">
            <p>{lesson.description}</p>
            {!isCompleted && (
              <div className="my-4 text-sm text-gray-500 flex items-center gap-2 bg-primary-500/5 border border-primary-500/20 rounded-lg p-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <span>
                  {lesson.type === 'VIDEO' 
                    ? 'Watch at least 80% of the video to unlock the complete button'
                    : 'View the content below and click "Mark as Complete" when finished'}
                </span>
              </div>
            )}
            {lesson.type === 'VIDEO' && (
              <div className="aspect-video bg-black rounded-lg mt-4 flex items-center justify-center">
                {lesson.content.includes('youtube') ? (
                  <iframe
                    ref={videoRef}
                    src={lesson.content.replace('watch?v=', 'embed/')}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                ) : (
                  <a href={lesson.content} target="_blank" rel="noreferrer" className="text-primary-400 underline">Watch Video</a>
                )}
              </div>
            )}
            {lesson.type === 'IMAGE' && (
              <img src={lesson.content} alt={lesson.title} className="w-full rounded-lg mt-4" />
            )}
            {lesson.type === 'DOCUMENT' && (
              <div className="whitespace-pre-wrap bg-dark-800 p-6 rounded-lg mt-4 font-mono text-sm">
                {lesson.content}
              </div>
            )}

          </div>
          
          {/* Manual Complete Button */}
          <div className="mt-8 pt-6 border-t border-dark-700 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              {isCompleted 
                ? 'Great job! You\'ve completed this lesson.' 
                : canComplete || lesson.type !== 'VIDEO'
                ? 'Ready to mark this lesson as complete?'
                : 'Keep watching... Complete button will appear after 80%'}
            </p>
            <div className="flex gap-3">
              {!isCompleted && (canComplete || lesson.type !== 'VIDEO') && (
                <button
                  onClick={handleManualComplete}
                  disabled={completing}
                  className="btn-primary px-6 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {completing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Mark as Complete
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="btn-secondary px-6 py-3"
              >
                Back to Course
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden font-sans">
      {/* 🏎️ PREMIUM SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-dark-900 border-r border-dark-700/50 shadow-2xl transition-all duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
        <div className="p-6 border-b border-dark-700 bg-dark-900/50 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <Link to={`/courses/${courseId}`} className="text-primary-400 hover:text-primary-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">{lesson.unitTitle || 'Introduction'}</div>
          <h2 className="font-bold text-white text-lg leading-tight tracking-tight">{lesson.title}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Curriculum Sections</div>
            {sections.map((section, idx) => (
              section.type !== 'code' && (
                <button
                  key={idx}
                  onClick={() => scrollToSection(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[14px] transition-all duration-300 flex items-center justify-between group ${activeSection === idx
                    ? 'bg-primary-600/10 text-primary-400 border border-primary-500/30'
                    : 'text-gray-400 hover:bg-dark-800 hover:text-gray-100 border border-transparent'
                    }`}
                >
                  <span className="truncate pr-4">{section.heading || section.title || `Module Part ${idx + 1}`}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeSection === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                </button>
              )
            ))}
          </div>

          <div className="pt-6 border-t border-dark-800">
            <div className="px-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Course Progress</div>
            <div className="px-3">
              <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full w-2/3 shadow-glow animate-pulse" />
              </div>
              <div className="mt-2 text-[10px] text-gray-500 font-bold flex justify-between">
                <span>MODULE 04 OF 12</span>
                <span className="text-primary-400">65% COMPLETED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-dark-800 bg-dark-900/50">
          <button onClick={() => navigate(`/courses/${courseId}`)} className="btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2">
            Leave Session
          </button>
        </div>
      </div>

      {/* 🚀 MAIN LEARNING CANVAS */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-dark-950 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-accent-purple/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-dark-700 bg-dark-900/80 backdrop-blur-md sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-dark-800 rounded-lg text-gray-400">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-white text-sm truncate px-4">{lesson.title}</span>
          <div className="w-9" />
        </div>

        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-4xl mx-auto px-6 py-12 md:px-12 lg:py-20 animate-slide-up">
            {/* Header Identity */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge badge-info bg-primary-500/10 border-primary-500/20 text-primary-400 text-[10px] font-black tracking-widest uppercase py-1 px-3">
                  Knowledge Hub
                </span>
                {lesson.unitTitle && (
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    In {lesson.unitTitle}
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight flex-1">
                  {lesson.title}
                </h1>
                {isCompleted && (
                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl font-bold text-sm animate-scale-in">
                    <CheckCircle className="w-5 h-5" />
                    <span>Completed</span>
                  </div>
                )}
              </div>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light border-l-4 border-primary-500 pl-6 py-2 bg-primary-500/5 rounded-r-2xl">
                {lesson.description}
              </p>
              {!isCompleted && (lesson.type === 'VIDEO' || lesson.type === 'DOCUMENT' || lesson.type === 'PDF' || lesson.type === 'IMAGE') && (
                <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  <span>
                    {lesson.type === 'VIDEO' && lesson.content.includes('youtube')
                      ? 'YouTube: Watch 80% to unlock the complete button below'
                      : lesson.type === 'VIDEO' 
                      ? 'Watch 80% of the video to unlock the complete button and auto-save your progress' 
                      : 'Progress will be automatically tracked after 30 seconds of viewing'}
                  </span>
                </div>
              )}
            </div>

            {/* 📺 VIDEO CONTENT VIEW */}
            {lesson.type === 'VIDEO' && (
              <div className="mb-16 animate-scale-in">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-dark-800 bg-black group hover:border-primary-500/30 transition-all duration-500">
                  {lesson.content.includes('youtube') || lesson.content.includes('youtu.be') ? (
                    <iframe
                      ref={videoRef}
                      src={lesson.content.includes('v=') ? lesson.content.replace('watch?v=', 'embed/') : lesson.content.replace('youtu.be/', 'youtube.com/embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title={lesson.title}
                    />
                  ) : lesson.content.includes('http') ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center">
                      <div className="w-20 h-20 rounded-full bg-primary-600/10 flex items-center justify-center mb-6">
                        <BookOpen className="w-10 h-10 text-primary-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">External Educational Video</h3>
                      <p className="text-gray-400 mb-8 max-w-sm">This lesson utilizes a specialized external platform for high-bandwidth video delivery.</p>
                      <a
                        href={lesson.content}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary flex items-center gap-2 group-hover:shadow-glow"
                      >
                        Open Video Stream 🏎️
                      </a>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      className="w-full h-full"
                      controls
                      src={lesson.content}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            )}

            {/* 🖼️ IMAGE CONTENT VIEW */}
            {lesson.type === 'IMAGE' && (
              <div className="mb-16 animate-scale-in">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-dark-800 overflow-hidden">
                  <img src={lesson.content} alt={lesson.title} className="w-full h-auto object-contain bg-dark-900" />
                </div>
                <p className="mt-4 text-center text-xs text-gray-500 font-bold uppercase tracking-widest">Visual Reference Module</p>
              </div>
            )}

            {/* 📝 DOCUMENTATION CONTENT VIEW (PDF/TEXT/MARKDOWN) */}
            <div className="space-y-12">
              {sections.map((section, idx) => {
                const heading = section.heading || section.title;
                const contentLines = Array.isArray(section.content)
                  ? section.content
                  : (section.content || '').split('\n');

                return (
                  <div key={idx} id={`section-${idx}`} className="mb-12 scroll-mt-32">
                    {heading && section.type !== 'code' && (
                      <h2 className="text-2xl md:text-3xl font-black text-white mb-8 flex items-center gap-4 group">
                        <span className="w-8 h-8 rounded-lg bg-primary-600/20 text-primary-400 text-sm flex items-center justify-center border border-primary-500/20 shrink-0">
                          {idx + 1}
                        </span>
                        {heading}
                        <div className="flex-1 h-px bg-dark-800 group-hover:bg-primary-500/30 transition-colors" />
                      </h2>
                    )}

                    {section.type === 'code' ? (
                      <div className="my-8 rounded-2xl overflow-hidden border border-dark-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-[#0d0d0d] group">
                        <div className="bg-[#1a1a1a] px-6 py-3 flex items-center justify-between border-b border-dark-700">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1.5 mr-4">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60 transition-colors group-hover:bg-red-500"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 transition-colors group-hover:bg-yellow-500"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60 transition-colors group-hover:bg-green-500"></div>
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Syntax Terminal</span>
                          </div>

                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(contentLines.join('\n'));
                              alert('Code copied to clipboard!');
                            }}
                            className="text-[10px] font-black text-primary-400 hover:text-primary-300 uppercase tracking-widest transition-colors"
                          >
                            Copy Snippet
                          </button>
                        </div>
                        <div className="p-8 overflow-x-auto scrollbar-thin scrollbar-thumb-primary-900">
                          <pre className="text-sm md:text-[15px] font-mono text-gray-300 leading-relaxed selection:bg-primary-500/30">
                            <code>
                              {contentLines.join('\n')}
                            </code>
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-300 text-[17px] md:text-lg leading-[1.8] space-y-6 font-light">
                        {contentLines.map((paragraph, pIdx) => (
                          paragraph.trim() && (
                            <p key={pIdx} className="first-letter:text-primary-400 first-letter:font-bold">
                              {paragraph}
                            </p>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 🏁 COMPLETION NAVIGATOR */}
            <div className="mt-24 pt-12 border-t border-dark-800 flex flex-col md:flex-row justify-between items-center gap-8 bg-dark-900/40 p-10 rounded-[2.5rem] border border-dark-700/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 blur-3xl rounded-full" />
              <div className="z-10 text-center md:text-left">
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                  {isCompleted ? 'Milestone Reached!' : 'Ready to Complete?'}
                </h3>
                <p className="text-gray-400 text-sm max-w-sm">
                  {isCompleted 
                    ? 'You have absorbed the core concepts of this module. Ready to elevate your mastery?' 
                    : 'Mark this lesson as complete to track your progress.'}
                </p>
              </div>
              <div className="flex gap-4 z-10 w-full md:w-auto">
                {!isCompleted && (canComplete || lesson.type !== 'VIDEO') && (
                  <button
                    onClick={handleManualComplete}
                    disabled={completing}
                    className="flex-1 md:flex-none btn-primary px-10 py-4 text-sm font-black shadow-glow-lg flex items-center justify-center gap-2 group-hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {completing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Mark as Complete
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => navigate(`/courses/${courseId}`)}
                  className="flex-1 md:flex-none btn-secondary px-8 py-4 text-sm font-bold"
                >
                  Curriculum Map
                </button>
                <button
                  onClick={() => navigate(`/courses/${courseId}`)}
                  className="flex-1 md:flex-none btn-primary px-10 py-4 text-sm font-black shadow-glow-lg flex items-center justify-center gap-2 group-hover:scale-105 transition-all"
                >
                  {isCompleted ? 'Next Module' : 'Back to Course'} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const X = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default LessonView;
