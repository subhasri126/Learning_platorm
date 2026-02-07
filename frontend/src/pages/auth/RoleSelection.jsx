import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, GraduationCap, Shield, ArrowRight } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-accent-purple to-accent-pink rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
              LearnSphere
            </h1>
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Choose your role to continue</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Learner */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Link
              to="/auth/learner"
              className="block card-gradient p-8 text-center hover:border-accent-purple transition-all group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-accent-purple" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Continue as Learner</h3>
              <p className="text-gray-400 text-sm mb-4">
                Access courses, earn XP, and level up your skills
              </p>
              <div className="flex items-center justify-center text-accent-purple font-semibold">
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* Instructor */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Link
              to="/auth/instructor"
              className="block card-gradient p-8 text-center hover:border-primary-500 transition-all group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instructor Login</h3>
              <p className="text-gray-400 text-sm mb-4">
                Manage courses, track learner progress
              </p>
              <div className="flex items-center justify-center text-primary-500 font-semibold">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* Admin */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Link
              to="/auth/admin"
              className="block card-gradient p-8 text-center hover:border-accent-gold transition-all group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-gold/20 to-accent-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-accent-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Admin Login</h3>
              <p className="text-gray-400 text-sm mb-4">
                Platform management and system controls
              </p>
              <div className="flex items-center justify-center text-accent-gold font-semibold">
                <span>Access Admin</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Register Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-400">
            New to LearnSphere?{' '}
            <Link to="/register" className="text-accent-purple hover:text-accent-pink font-semibold">
              Create an account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
