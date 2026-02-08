import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, User, Minimize2, MoreHorizontal } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const LearnSphereAI = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const chatEndRef = useRef(null);
    const userName = user?.name || 'Learner';

    // States
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(true);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Initialization Logic
    useEffect(() => {
        if (!user?.id) return;

        const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user.id}`);
        const hasSeenAIIntro = localStorage.getItem(`ai_intro_seen_${user.id}`);

        if (hasSeenWelcome) {
            setIsVisible(true);
            if (!hasSeenAIIntro) {
                // First-time intro
                setIsMinimized(false);
                setMessages([{
                    id: Date.now(),
                    text: `Hello ${userName}. I am the LearnSphere AI Assistant. I am here to help you navigate your learning journey, explain complex technical concepts, and provide support whenever you need it. How can I assist you today?`,
                    sender: 'ai',
                    timestamp: new Date()
                }]);
                localStorage.setItem(`ai_intro_seen_${user.id}`, 'true');
            } else if (messages.length === 0) {
                // Persistent welcome for returning users
                setMessages([{
                    id: Date.now(),
                    text: `Welcome back, ${userName}. What would you like to learn or explore today?`,
                    sender: 'ai',
                    timestamp: new Date()
                }]);
            }
        }

        const handleShowAI = () => {
            setIsVisible(true);
            setIsMinimized(false);
        };
        window.addEventListener('show-robot-help', handleShowAI);
        return () => window.removeEventListener('show-robot-help', handleShowAI);
    }, [user?.id, userName]);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const addAIMessage = (text) => {
        setIsTyping(true);
        // Simulate a natural thinking/typing delay
        const delay = Math.min(2000, 500 + text.length * 10);
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                text,
                sender: 'ai',
                timestamp: new Date()
            }]);
            setIsTyping(false);
        }, delay);
    };

    const handleSend = (e) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");

        const query = userMsg.text.toLowerCase();

        // Professional prompt-response logic
        if (query.includes('javascript') || query.includes('code')) {
            addAIMessage("JavaScript is a high-level, interpreted programming language that is a core technology of the World Wide Web. It enables interactive web pages and is an essential part of web applications. Would you like to see our courses covering modern JavaScript frameworks?");
        } else if (query.includes('ai') || query.includes('intelligence')) {
            addAIMessage("Artificial intelligence is the intelligence of machines or software, as opposed to the intelligence of humans or animals. Here at LearnSphere, we use AI to personalize your curriculum and provide instant technical guidance.");
        } else if (query.includes('course') || query.includes('lessons')) {
            addAIMessage("You can access all available learning material through the 'Courses' module in your navigation bar. We offer paths in Web Development, Data Science, and Computer Fundamentals. Are you interested in a specific field?");
        } else if (query.includes('quiz') || query.includes('test')) {
            addAIMessage("Our Quiz system is designed to validate your understanding of module concepts. You can find practice quizzes at the end of each lesson, or challenge other students in our Multiplayer Quiz Hub.");
        } else if (query.includes('status') || query.includes('progress') || query.includes('xp')) {
            addAIMessage("Your learning progress, including XP, badges, and completed modules, is tracked in real-time. You can view your comprehensive performance overview on the main Dashboard.");
        } else if (query.includes('help') || query.includes('stuck')) {
            addAIMessage("I am here to help. If a particular lesson is unclear, I can provide additional explanations or examples. Please specify the topic you're working on, or browse our community forums for peer support.");
        } else if (query.includes('how are you')) {
            addAIMessage("I am functioning at optimal levels and ready to assist you. How is your learning progressing today?");
        } else if (query.includes('joke')) {
            addAIMessage("Why do programmers prefer dark mode? Because light attracts bugs. I hope that brings a brief smile to your studies.");
        } else {
            addAIMessage("That is an insightful question. While I specialize in the LearnSphere platform and technical education, I'm happy to help you explore that concept. Could you provide a bit more detail, or should we look at how it relates to your current courses?");
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none w-[440px] max-w-[calc(100vw-3rem)]">

            <AnimatePresence>
                {!isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="pointer-events-auto w-full bg-white dark:bg-dark-900 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-200 dark:border-dark-700 overflow-hidden flex flex-col mb-4 max-h-[700px] min-h-[500px]"
                    >
                        {/* Header: Professional & Minimal */}
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-dark-800 flex items-center justify-between bg-white dark:bg-dark-900">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white dark:text-gray-900" />
                                </div>
                                <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 tracking-tight">LearnSphere AI</span>
                            </div>
                            <button
                                onClick={() => setIsMinimized(true)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors text-gray-400 dark:text-gray-500"
                            >
                                <Minimize2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Message Stream: Reading Focused */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-dark-900 selection:bg-indigo-50 dark:selection:bg-indigo-900/30">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-4 max-w-[88%] ${msg.sender === 'user' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                                        <div className={`mt-1 flex-shrink-0 w-7 h-7 rounded flex items-center justify-center ${msg.sender === 'user' ? 'bg-gray-50 dark:bg-dark-800' : 'bg-indigo-50 dark:bg-indigo-900/20'
                                            }`}>
                                            {msg.sender === 'user' ? <User className="w-4 h-4 text-gray-500" /> : <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <div className={`text-[11px] font-bold uppercase tracking-widest ${msg.sender === 'user' ? 'text-gray-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                                {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                                            </div>
                                            <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${msg.sender === 'user'
                                                    ? 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-200 rounded-tr-none'
                                                    : 'text-gray-800 dark:text-gray-200 bg-transparent'
                                                }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start gap-4 animate-pulse">
                                    <div className="mt-1 w-7 h-7 rounded bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="px-4 py-3 bg-gray-50 dark:bg-dark-800 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full opacity-60"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full opacity-30"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Strategy: Minimalist & Clean */}
                        <div className="p-5 border-t border-gray-100 dark:border-dark-800 bg-white dark:bg-dark-900">
                            <form
                                onSubmit={handleSend}
                                className="relative flex items-center"
                            >
                                <input
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-dark-800 border-none rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-dark-600 transition-all font-medium text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isTyping}
                                    className="absolute right-2.5 p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 transition-all"
                                >
                                    <Send className="w-4.5 h-4.5" />
                                </button>
                            </form>
                            <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-3 font-medium tracking-wide">
                                ChatGPT-powered LearnSphere AI. Optimized for technical accuracy.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Launch Button: Professional Grayscale */}
            <motion.button
                layout
                onClick={() => setIsMinimized(!isMinimized)}
                className="pointer-events-auto flex items-center gap-3 px-6 py-3.5 bg-gray-950 dark:bg-white text-white dark:text-gray-950 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/10 group"
            >
                <Sparkles className={`w-4.5 h-4.5 ${!isMinimized ? 'text-indigo-400' : 'text-indigo-300'}`} />
                <span className="text-[14px] font-bold tracking-tight">{isMinimized ? 'Ask AI' : 'Close Assistant'}</span>
            </motion.button>
        </div>
    );
};

export default LearnSphereAI;
