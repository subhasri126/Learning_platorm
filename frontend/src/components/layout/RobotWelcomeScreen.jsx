import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Layout, Sparkles, ArrowRight, BookOpen, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RobotWelcomeScreen = ({ user, onComplete }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center p-6 overflow-y-auto">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
            </div>

            <div className="max-w-4xl w-full flex flex-col items-center text-center relative z-10">

                {/* Visual Identity */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="mb-12"
                >
                    <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center shadow-2xl relative">
                        <Sparkles className="w-10 h-10 text-white" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl"
                        />
                    </div>
                </motion.div>

                {/* Typography */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Platform Onboarding
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Welcome to LearnSphere, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                            {user?.name || 'Partner'}.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Your intelligent learning assistant is ready to guide you. Discover personalized paths and master new skills with AI-driven insights.
                    </p>
                </motion.div>

                {/* Professional Action Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl"
                >
                    <ActionCard
                        icon={BookOpen}
                        label="Learning Paths"
                        description="Explore our curated technical curriculum"
                        onClick={() => { navigate('/courses'); onComplete(); }}
                    />
                    <ActionCard
                        icon={Layout}
                        label="Dashboard"
                        description="Monitor your professional growth & stats"
                        onClick={onComplete}
                        highlight
                    />
                    <ActionCard
                        icon={Trophy}
                        label="Skill Assessments"
                        description="Validate your knowledge with AI Quizzes"
                        onClick={() => { navigate('/quiz'); onComplete(); }}
                    />
                </motion.div>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    onClick={onComplete}
                    className="mt-12 text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                    Skip introduction <ArrowRight className="w-4 h-4" />
                </motion.button>
            </div>
        </div>
    );
};

const ActionCard = ({ icon: Icon, label, description, onClick, highlight = false }) => (
    <button
        onClick={onClick}
        className={`group p-8 rounded-2xl border transition-all duration-300 flex flex-col items-start text-left gap-4 active:scale-[0.98] ${highlight
            ? "bg-gray-900 border-gray-900 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1"
            : "bg-white border-gray-100 text-gray-900 shadow-sm hover:border-gray-200 hover:shadow-md hover:-translate-y-1"
            }`}
    >
        <div className={`p-3 rounded-xl ${highlight ? "bg-white/10" : "bg-gray-50 group-hover:bg-indigo-50"} transition-colors`}>
            <Icon className={`w-6 h-6 ${highlight ? "text-white" : "text-gray-900"}`} />
        </div>
        <div>
            <div className="font-bold text-lg mb-1">{label}</div>
            <div className={`text-sm ${highlight ? "text-gray-400" : "text-gray-500"} leading-snug`}>{description}</div>
        </div>
    </button>
);

export default RobotWelcomeScreen;
