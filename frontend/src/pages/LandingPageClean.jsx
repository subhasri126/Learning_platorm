import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Zap, ArrowRight, Shield, BookOpen, Award, Users,
    Code, Terminal, Database, Globe, Cpu, Layers,
    CheckCircle, Sparkles, Bot
} from 'lucide-react';

const LandingPageClean = () => {

    // --- Course Data (Hardcoded for Preview) ---
    const courses = [
        { title: "JavaScript Basics", desc: "Master the language of the web.", level: "Beginner", icon: Code, color: "text-yellow-400" },
        { title: "React Fundamentals", desc: "Build modern UI with hooks & components.", level: "Intermediate", icon: Layers, color: "text-blue-400" },
        { title: "Python Programming", desc: "Data science, automation & more.", level: "Beginner", icon: Terminal, color: "text-emerald-400" },
        { title: "Web Development", desc: "HTML5, CSS3, & Responsive Design.", level: "Beginner", icon: Globe, color: "text-orange-400" },
        { title: "Data Structures", desc: "Ace your coding interviews.", level: "Advanced", icon: Cpu, color: "text-purple-400" },
        { title: "SQL & Databases", desc: "Master relational data management.", level: "Intermediate", icon: Database, color: "text-cyan-400" },
        { title: "Computer Fundamentals", desc: "How computers really work.", level: "Beginner", icon: Cpu, color: "text-gray-400" },
        { title: "Full Stack Dev", desc: "MERN Stack mastery.", level: "Advanced", icon: Layers, color: "text-pink-400" }
    ];

    // --- Animation Variants ---
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-dark-950 text-white font-sans overflow-x-hidden selection:bg-primary-500/30">

            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[128px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[128px] animate-pulse-slow delay-1000"></div>
            </div>

            {/* 1️⃣ HERO SECTION */}
            <section className="relative z-10 min-h-screen flex flex-col justify-center px-6 pt-10 pb-20">
                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Text */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-center lg:text-left order-2 lg:order-1"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">New: AI Tutor Support</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
                            Master Tech Skills. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-purple to-pink-400">
                                Build Your Future.
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Structured courses, interactive quizzes, and a gamified community.
                            Join 10,000+ learners changing their careers today.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link
                                to="/auth"
                                state={{ isRegister: true }}
                                className="btn-primary w-full sm:w-auto px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-primary-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/auth"
                                className="px-8 py-4 text-lg font-medium text-gray-300 hover:text-white transition-colors border-b border-transparent hover:border-gray-500"
                            >
                                Sign In
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right: Robot & Visuals */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative order-1 lg:order-2 flex justify-center"
                    >
                        {/* 🤖 ROBOT MASCOT */}
                        <div className="relative w-64 h-64 md:w-80 md:h-80">
                            {/* Floating Animation Wrapper */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700/50 rounded-[2rem] shadow-2xl flex items-center justify-center relative z-10"
                            >
                                <div className="absolute inset-4 bg-dark-950 rounded-[1.5rem] flex items-center justify-center overflow-hidden">
                                    {/* Robot Face */}
                                    <div className="text-center">
                                        <div className="flex gap-4 mb-4 justify-center">
                                            <motion.div
                                                animate={{ height: [12, 2, 12] }}
                                                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                                                className="w-8 h-3 bg-primary-400 rounded-full"
                                            ></motion.div>
                                            <motion.div
                                                animate={{ height: [12, 2, 12] }}
                                                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                                                className="w-8 h-3 bg-primary-400 rounded-full"
                                            ></motion.div>
                                        </div>
                                        <div className="w-16 h-2 bg-dark-800 rounded-full mx-auto relative overflow-hidden">
                                            <motion.div
                                                animate={{ x: [-20, 20, -20] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-8 h-full bg-primary-500/50 rounded-full loading-bar"
                                            ></motion.div>
                                        </div>
                                    </div>
                                </div>

                                {/* Antenna */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-6 bg-gray-600"></div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
                            </motion.div>

                            {/* Speech Bubble */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ delay: 1, type: "spring" }}
                                className="absolute -top-12 -right-12 md:-right-24 bg-white text-dark-900 p-4 rounded-2xl rounded-bl-sm shadow-xl z-20 max-w-[200px]"
                            >
                                <p className="text-sm font-bold leading-tight">
                                    Hi! I’m <span className="text-primary-600">Botty</span> 🤖 <br />
                                    Let’s explore LearnSphere!
                                </p>
                            </motion.div>

                            {/* Background Elements */}
                            <div className="absolute -inset-10 bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 2, duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 text-sm flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] uppercase tracking-widest">Scroll to Explore</span>
                    <div className="w-[1px] h-8 bg-gradient-to-b from-gray-500 to-transparent"></div>
                </motion.div>
            </section>

            {/* 2️⃣ WHY LEARNSPHERE (Features) */}
            <section className="py-24 bg-dark-900 border-y border-dark-800/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Modern Learners</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Skip the boring textbooks. We've gamified the entire experience.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: BookOpen, title: "Structured Learning", desc: "Step-by-step paths from Zero to Hero." },
                            { icon: Award, title: "Game-like Quizzes", desc: "Earn XP, badges, and climb the leaderboard." },
                            { icon: Users, title: "Multiplayer Battles", desc: "Challenge friends to real-time coding duels." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-2xl bg-dark-800/50 border border-dark-700/50 hover:border-primary-500/30 transition-all group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-dark-700/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-primary-400 shadow-lg shadow-black/20">
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3️⃣ COURSE PREVIEW GRID */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Explore Courses</h2>
                            <p className="text-gray-400">Hand-picked curriculums for every skill level.</p>
                        </div>
                        <Link to="/auth" className="flex items-center gap-2 text-primary-400 font-medium hover:text-white transition-colors">
                            View All Courses <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((course, idx) => (
                            <Link to="/auth" key={idx}>
                                <motion.div
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="h-full p-6 rounded-2xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all group cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-3 rounded-xl bg-dark-900 ${course.color}`}>
                                            <course.icon className="w-6 h-6" />
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wide ${course.level === "Beginner" ? "bg-emerald-500/10 text-emerald-400" :
                                            course.level === "Intermediate" ? "bg-yellow-500/10 text-yellow-400" :
                                                "bg-red-500/10 text-red-400"
                                            }`}>
                                            {course.level}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary-400 transition-colors">{course.title}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2">{course.desc}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4️⃣ FINAL CTA */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent pointer-events-none"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                            Stop Waiting. <br />
                            Start <span className="text-primary-400">Winning.</span>
                        </h2>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            Join the community of developers who have leveled up their careers with LearnSphere.
                        </p>
                        <Link
                            to="/auth"
                            state={{ isRegister: true }}
                            className="btn-primary inline-flex items-center gap-3 px-12 py-5 text-xl rounded-full shadow-2xl hover:shadow-primary-500/50 transform hover:scale-105 transition-all"
                        >
                            Start Learning Now
                            <Sparkles className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-dark-950 border-t border-dark-900 text-center text-gray-600 text-sm">
                <p>&copy; 2026 LearnSphere. Crafted for the future.</p>
            </footer>
        </div>
    );
};



export default LandingPageClean;
