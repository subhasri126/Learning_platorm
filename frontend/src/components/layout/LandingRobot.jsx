import React from 'react';
import { motion } from 'framer-motion';
import { Bot, X } from 'lucide-react';

const LandingRobot = () => {
    const [isVisible, setIsVisible] = React.useState(true);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed bottom-8 left-8 z-50 max-w-sm hidden md:block"
        >
            <div className="bg-dark-800/90 backdrop-blur-md border border-primary-500/30 rounded-2xl shadow-2xl p-4 relative overflow-hidden group hover:bg-dark-800 transition-colors">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-500 hover:text-white"
                >
                    <X className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-4">
                    <motion.div
                        animate={{
                            y: [0, -5, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center border border-primary-500/30"
                    >
                        <Bot className="w-6 h-6 text-primary-400" />
                    </motion.div>

                    <div>
                        <p className="text-sm font-medium text-white">Hi! I'm A.I.D.E.</p>
                        <p className="text-xs text-primary-300">Ready to start?</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LandingRobot;
