import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { User, GraduationCap, Shield, ArrowLeft, Mail, Lock } from 'lucide-react';

const RoleLogin = () => {
  const { role } = useParams(); // learner, instructor, or admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roleConfig = {
    learner: {
      icon: <User className="w-8 h-8" />,
      title: 'Learner Login',
      color: 'accent-purple',
      gradient: 'from-accent-purple to-accent-pink',
      demoEmail: 'learner1@learnsphere.com',
    },
    instructor: {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Instructor Login',
      color: 'primary-500',
      gradient: 'from-primary-500 to-primary-600',
      demoEmail: 'instructor@learnsphere.com',
    },
    admin: {
      icon: <Shield className="w-8 h-8" />,
      title: 'Admin Login',
      color: 'accent-gold',
      gradient: 'from-accent-gold to-accent-orange',
      demoEmail: 'admin@learnsphere.com',
    },
  };

  const config = roleConfig[role] || roleConfig.learner;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      const userRole = response.data.user.role.toLowerCase();
      
      // Validate role matches login type
      if (userRole !== role) {
        setError(`This account is not registered as a ${role}. Please use the correct login.`);
        setLoading(false);
        return;
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail(config.demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to role selection
        </button>

        {/* Card */}
        <div className="card-solid">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 bg-gradient-to-br from-${config.color}/20 to-${config.color}/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-${config.color}`}>
              {config.icon}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{config.title}</h2>
            <p className="text-gray-400 text-sm">Enter your credentials to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary bg-gradient-to-r ${config.gradient} disabled:opacity-50`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Account */}
          <div className="mt-6 pt-6 border-t border-dark-700">
            <p className="text-xs text-gray-500 text-center mb-2">Try demo account:</p>
            <button
              type="button"
              onClick={fillDemo}
              className="w-full text-sm text-gray-400 hover:text-white transition-colors"
            >
              {config.demoEmail} / password123
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleLogin;
