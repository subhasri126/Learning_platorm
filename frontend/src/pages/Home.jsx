import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Zap, Target, Users, BookOpen, Award, TrendingUp, Star } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    { icon: <BookOpen className="w-8 h-8" />, title: 'Rich Course Content', desc: 'Video lessons, documents, and interactive content from expert instructors.' },
    { icon: <Target className="w-8 h-8" />, title: 'Interactive Quizzes', desc: 'Test your knowledge with game-like quizzes and earn XP with multiple attempts.' },
    { icon: <Trophy className="w-8 h-8" />, title: 'Level Up System', desc: 'Gain XP, unlock achievements, and compete on leaderboards.' },
  ];

  const stats = [
    { number: '10K+', label: 'Active Learners', icon: <Users className="w-6 h-6" /> },
    { number: '500+', label: 'Expert Courses', icon: <BookOpen className="w-6 h-6" /> },
    { number: '50K+', label: 'XP Earned Daily', icon: <Zap className="w-6 h-6" /> },
  ];

  const gamificationFeatures = [
    { icon: '🎮', title: 'Game-Like Experience', desc: 'Learn feels like playing your favorite game' },
    { icon: '⚡', title: 'Instant Feedback', desc: 'Get real-time results and celebrate wins' },
    { icon: '🏆', title: 'Achievements System', desc: 'Unlock badges and show off your progress' },
    { icon: '📊', title: 'Track Everything', desc: 'Detailed analytics of your learning journey' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-850">
      {/* Navigation */}
      <nav className="bg-dark-800/50 backdrop-blur-xl border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <Zap className="w-8 h-8 text-accent-purple" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
                LearnSphere
              </h1>
            </motion.div>
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-4"
            >
              <Link to="/auth" className="btn-ghost text-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Start Learning →
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-4"
          >
            <span className="badge-level animate-pulse-slow">
              🎮 Gaming-Inspired Learning Platform
            </span>
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary-400 via-accent-purple to-accent-pink bg-clip-text text-transparent">
              Level Up
            </span>
            <br />
            <span className="text-white">Your Skills</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Transform learning into an epic adventure. Earn XP, unlock achievements, 
            climb leaderboards, and master new skills with our gamified platform.
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              <Zap className="w-5 h-5 inline mr-2" />
              Start Free Journey
            </Link>
            <a href="#features" className="btn-secondary text-lg px-8 py-4">
              <Star className="w-5 h-5 inline mr-2" />
              Explore Features
            </a>
          </div>

          {/* Hero Stats */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="card-gradient p-4"
              >
                <div className="text-accent-purple mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.number}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <div id="features" className="mt-32">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Learners <span className="text-accent-purple">Love Us</span>
            </h2>
            <p className="text-gray-400 text-lg">Everything you need to succeed, gamified</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="card-hover text-center"
              >
                <div className="text-accent-purple mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gamification Showcase */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 border border-accent-purple/30 rounded-3xl p-12"
        >
          <div className="text-center mb-12">
            <Trophy className="w-16 h-16 text-accent-gold mx-auto mb-4 animate-float" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Learning That Feels Like <span className="text-accent-gold">Gaming</span>
            </h2>
            <p className="text-gray-300 text-lg">Not your average boring LMS</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gamificationFeatures.map((item, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-solid text-center"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <div className="mt-32">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Your <span className="text-primary-400">Learning Journey</span>
            </h2>
            <p className="text-gray-400 text-lg">Four simple steps to mastery</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up for free', icon: '🚀' },
              { step: '2', title: 'Choose Courses', desc: 'Pick your path', icon: '🎯' },
              { step: '3', title: 'Earn XP', desc: 'Complete & level up', icon: '⚡' },
              { step: '4', title: 'Get Certified', desc: 'Show your skills', icon: '🏆' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="card-gradient text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-3xl font-bold text-accent-purple mb-2">{item.step}</div>
                  <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <TrendingUp className="w-8 h-8 text-accent-purple/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 bg-gradient-gaming rounded-3xl p-12 text-center"
        >
          <Award className="w-16 h-16 text-white mx-auto mb-6 animate-float" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Epic Quest?
          </h2>
          <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of learners earning XP, unlocking achievements, and mastering new skills every day.
          </p>
          <Link to="/register" className="btn-primary text-lg px-10 py-4 bg-white text-purple-700 hover:bg-gray-100">
            <Zap className="w-5 h-5 inline mr-2" />
            Begin Adventure - It's Free!
          </Link>
          <p className="text-white/70 mt-4 text-sm">
            Demo: learner1@learnsphere.com / password123
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-dark-950 border-t border-dark-800 py-12 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-accent-purple" />
                <h3 className="font-bold text-white">LearnSphere</h3>
              </div>
              <p className="text-gray-500 text-sm">
                Gamified learning for the modern age.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><Link to="/auth" className="hover:text-white">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>XP & Levels</li>
                <li>Achievements</li>
                <li>Leaderboards</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Test Accounts</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>learner1@learnsphere.com</li>
                <li>instructor@learnsphere.com</li>
                <li>Password: password123</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 LearnSphere. Gamified learning redefined.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
