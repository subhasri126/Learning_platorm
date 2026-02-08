import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X } from 'lucide-react';

const WelcomeRobot = ({ userName, onClose }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                className="fixed bottom-8 right-8 z-50 max-w-sm"
            >
                <div className="bg-dark-800 border border-primary-500/30 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white rounded-full hover:bg-dark-700 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-purple rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20"
                            >
                                <Bot className="w-8 h-8 text-white" />
                            </motion.div>
                        </div>

                        <div>
                            <h3 className="font-bold text-white text-lg mb-1">Welcome, {userName}! 🚀</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Welcome to LearnSphere. Let's start your learning journey together!
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WelcomeRobot;
