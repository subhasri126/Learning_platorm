import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Users, BookOpen, Shield, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-dark-950 text-white font-sans overflow-x-hidden selection:bg-primary-500/30">

            {/* 1️⃣ HERO SECTION */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-0 pb-20">
                {/* Background Glows */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[128px] animate-pulse-slow"></div>
                    <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[128px] animate-pulse-slow delay-700"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/50 border border-dark-700 backdrop-blur-sm mb-8 hover:border-primary-500/30 transition-colors cursor-default">
                            <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></span>
                            <span className="text-sm font-medium text-gray-300">New: Multiplayer Quiz Battles</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
                            Master Any Skill. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-purple to-primary-400 bg-300% animate-gradient">
                                Together.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            The all-in-one platform for structured learning, real-time gamification, and community growth. Stop learning alone.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/auth"
                                state={{ isRegister: true }}
                                className="btn-primary w-full sm:w-auto px-8 py-4 text-lg rounded-full shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/auth"
                                className="w-full sm:w-auto px-8 py-4 text-lg font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2️⃣ VALUE SECTION */}
            <section className="py-24 bg-dark-900 border-y border-dark-800/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why LearnSphere?</h2>
                        <p className="text-gray-400 text-lg">We've reimagined the learning experience to keep you motivated and engaged from start to finish.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Target, title: "Structured Paths", desc: "Curated learning journeys that guide you step-by-step from beginner to expert." },
                            { icon: Zap, title: "Instant Feedback", desc: "Interactive quizzes and code challenges with real-time validation and explanations." },
                            { icon: Users, title: "Community Driven", desc: "Active study groups, peer reviews, and global leaderboards to keep you accountable." }
                        ].map((item, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-dark-800/50 border border-dark-700/50 hover:border-primary-500/30 transition-all hover:bg-dark-800 group">
                                <div className="w-12 h-12 rounded-xl bg-dark-700/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-primary-400">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3️⃣ EXPERIENCE SECTION */}
            <section className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <div className="relative">
                                {/* Abstract UI Placeholder */}
                                <div className="rounded-2xl bg-dark-800 border border-dark-700 p-6 shadow-2xl relative z-10 aspect-[4/3] flex items-center justify-center overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-purple/5 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-dark-700 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-bounce">
                                            <Trophy className="w-8 h-8 text-accent-gold" />
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Multiplayer Battles</h4>
                                        <p className="text-sm text-gray-500">Live 1v1 coding duels</p>
                                    </div>
                                </div>
                                <div className="absolute top-8 -right-8 w-full h-full border border-primary-500/20 rounded-2xl -z-10"></div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                Learning that feels like <br />
                                <span className="text-primary-400">Winning.</span>
                            </h2>
                            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                                Forget boring lectures. LearnSphere turns education into a game.
                                Earn XP for every lesson, unlock specialized badges, and challenge friends
                                to real-time knowledge battles.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    { icon: BookOpen, text: "Interactive PDF & Video Lessons" },
                                    { icon: Shield, text: "Verified Skill Badges" },
                                    { icon: Award, text: "Global Leaderboards & Seasons" }
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-6 h-6 rounded-full bg-primary-500/10 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-primary-400" />
                                        </div>
                                        {feature.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4️⃣ FINAL CTA SECTION */}
            <section className="py-32 text-center px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-900/10 pointer-events-none"></div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to start your journey?</h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Join thousands of developers mastering new skills today.
                        No credit card required.
                    </p>
                    <Link
                        to="/auth"
                        state={{ isRegister: true }}
                        className="btn-primary inline-flex items-center gap-2 px-10 py-5 text-xl rounded-full shadow-2xl hover:shadow-primary-500/40 transform hover:scale-105 transition-all"
                    >
                        Get Started for Free
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>

            {/* Minimal Footer (No Navbar links) */}
            <footer className="py-8 bg-dark-950 text-center text-gray-600 text-sm border-t border-dark-900">
                <p>&copy; 2026 LearnSphere. Built for learners.</p>
            </footer>
        </div>
    );
};

// Helper for icon fix
const shield = Shield; // Lucid icon casing

export default LandingPage;
