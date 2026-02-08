import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Loader2, Zap, User, GraduationCap, Shield } from 'lucide-react';

const AuthPage = ({ embedded = false }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (location.state?.isRegister) {
            setIsLogin(false);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' // Default
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role });
        setError('');
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('Please fill in all required fields.');
            return false;
        }
        if (!isLogin) {
            if (!formData.name) {
                setError('Please enter your name.');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match.');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            if (isLogin) {
                // Pass role if backend supported it, but mainly using email/pass
                // UI requirement: Role must be selected.
                await login(formData.email, formData.password, formData.role);
            } else {
                await register(formData.email, formData.password, formData.name, formData.role);
            }
            // Navigate to Dashboard with Welcome Flag
            navigate('/dashboard', { state: { showWelcome: true } });
        } catch (err) {
            console.error("Login Error:", err);
            if (!err.response) {
                setError('Network error: Cannot reach the server. Please check if the backend is running.');
            } else if (err.response.status === 401) {
                setError('Invalid credentials. Please check your email and password.');
            } else {
                setError(err.response?.data?.message || 'Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData(prev => ({ ...prev, name: '', email: '', password: '', confirmPassword: '' }));
    };

    if (embedded) {
        return (
            <div className="w-full max-w-md bg-dark-900/80 backdrop-blur-xl border border-dark-700/50 rounded-2xl shadow-2xl overflow-hidden relative z-10">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 mb-3">
                            <Zap className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">
                            {isLogin ? 'Sign In to LearnSphere' : 'Create Your Account'}
                        </h2>
                        <p className="text-gray-400 text-xs">
                            {isLogin ? 'Access your courses and progress' : 'Join thousands of learners today'}
                        </p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Role Selection - Login Only */}
                        {isLogin && (
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[
                                    { id: 'user', label: 'User', icon: User },
                                    { id: 'instructor', label: 'Instructor', icon: GraduationCap },
                                    { id: 'admin', label: 'Admin', icon: Shield }
                                ].map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => handleRoleSelect(role.id)}
                                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                                            formData.role === role.id
                                                ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                                                : 'bg-dark-800 border-dark-700 text-gray-400 hover:bg-dark-700'
                                        }`}
                                    >
                                        <role.icon className="w-4 h-4 mb-1" />
                                        <span className="text-[10px] font-medium uppercase tracking-wide">{role.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <AnimatePresence mode='popLayout'>
                            {!isLogin && (
                                <motion.div
                                    key="name-field"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors"
                                        placeholder="Full Name"
                                        required={!isLogin}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors"
                            placeholder="Email Address"
                            required
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors pr-8"
                                placeholder="Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                        </div>

                        <AnimatePresence mode='popLayout'>
                            {!isLogin && (
                                <motion.div
                                    key="confirm-password-field"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="mt-2">
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors"
                                            placeholder="Confirm Password"
                                            required={!isLogin}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading || (isLogin && !formData.role)}
                            className="w-full btn-primary py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all active:scale-[0.98] mt-2"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-4 text-center">
                        <p className="text-gray-400 text-xs">
                            {isLogin ? "No account? " : "Has account? "}
                            <button
                                onClick={toggleMode}
                                className="text-primary-400 font-medium hover:text-primary-300 transition-colors underline decoration-dotted underline-offset-2"
                            >
                                {isLogin ? 'Register' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Default Full Page Render
    return (
        <div className="min-h-screen w-full bg-dark-950 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[128px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-dark-900/50 backdrop-blur-xl border border-dark-700/50 rounded-2xl shadow-2xl overflow-hidden relative z-10"
            >
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 mb-4"
                        >
                            <Zap className="w-6 h-6" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {isLogin ? 'Welcome Back' : 'Join LearnSphere'}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {isLogin ? 'Select your role and sign in' : 'Start your learning journey today'}
                        </p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selection - Login Only */}
                        {isLogin && (
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                {[
                                    { id: 'user', label: 'User', icon: User },
                                    { id: 'instructor', label: 'Instructor', icon: GraduationCap },
                                    { id: 'admin', label: 'Admin', icon: Shield }
                                ].map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => handleRoleSelect(role.id)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                            formData.role === role.id
                                                ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                                                : 'bg-dark-800 border-dark-700 text-gray-400 hover:bg-dark-700'
                                        }`}
                                    >
                                        <role.icon className="w-5 h-5 mb-1" />
                                        <span className="text-xs font-medium">{role.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <AnimatePresence mode='popLayout'>
                            {!isLogin && (
                                <motion.div
                                    key="name-field"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="space-y-4">
                                        <div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors"
                                                placeholder="Full Name"
                                                required={!isLogin}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors"
                            placeholder="Email Address"
                            required
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors pr-10"
                                placeholder="Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <AnimatePresence mode='popLayout'>
                            {!isLogin && (
                                <motion.div
                                    key="confirm-password-field"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="mt-4">
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors"
                                            placeholder="Confirm Password"
                                            required={!isLogin}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading || (isLogin && !formData.role)}
                            className="w-full btn-primary py-3 rounded-xl font-medium shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all active:scale-[0.98] mt-4"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={toggleMode}
                                className="text-primary-400 font-medium hover:text-primary-300 transition-colors"
                            >
                                {isLogin ? 'Register' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
