import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { courseAPI } from '../../api/course.api';
import { useAuth } from '../../contexts/AuthContext';
import {
    Users, BookOpen, Award, TrendingUp,
    ArrowUpRight, ArrowDownRight, Activity, Calendar
} from 'lucide-react';
import Loading from '../../components/common/Loading';

const Analytics = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalLearners: 0,
        avgCompletion: 74,
        totalXP: 0,
        activeCourses: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGlobalStats = async () => {
            try {
                const response = await courseAPI.getAll();
                const myCourses = response.data.data.filter(c => c.instructorId == user.id);

                const totalLearners = myCourses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0);

                setStats({
                    totalLearners,
                    avgCompletion: 74,
                    totalXP: totalLearners * 150,
                    activeCourses: myCourses.length
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGlobalStats();
    }, [user.id]);

    if (loading) return <Loading />;

    const cards = [
        { label: 'Platform Reach', value: stats.totalLearners, trend: '+12%', up: true, icon: Users, color: 'text-primary-500' },
        { label: 'Content Depth', value: stats.activeCourses, trend: '+2', up: true, icon: BookOpen, color: 'text-blue-500' },
        { label: 'Avg Mastery', value: `${stats.avgCompletion}%`, trend: '-2%', up: false, icon: Award, color: 'text-yellow-500' },
        { label: 'Engagement', value: 'High', trend: 'Stable', up: true, icon: Activity, color: 'text-green-500' },
    ];

    return (
        <div className="min-h-screen bg-dark-950 p-6 md:p-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-5xl font-black text-white mb-2 tracking-tight">Performance Analytics</h1>
                    <p className="text-gray-400 text-lg">System-wide metrics for your teaching portfolio.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {cards.map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="card-solid group hover:border-primary-500/50 transition-all cursor-default"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-dark-800 ${card.color} group-hover:scale-110 transition-transform`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center text-xs font-bold ${card.up ? 'text-green-400' : 'text-red-400'}`}>
                                    {card.trend}
                                    {card.up ? <ArrowUpRight className="w-3 h-3 ml-0.5" /> : <ArrowDownRight className="w-3 h-3 ml-0.5" />}
                                </div>
                            </div>
                            <div className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{card.label}</div>
                            <div className="text-3xl font-black text-white">{card.value}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="card-solid">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary-500" />
                                Retention Trends
                            </h2>
                            <select className="bg-dark-800 border border-dark-700 text-xs text-gray-400 p-2 rounded-lg outline-none">
                                <option>Last 30 Days</option>
                                <option>Last 90 Days</option>
                            </select>
                        </div>
                        <div className="h-72 flex items-center justify-center text-gray-600 italic border border-dark-700/50 rounded-2xl bg-dark-900/40">
                            Growth chart integration pending...
                        </div>
                    </div>

                    <div className="card-solid">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary-500" />
                                Recent Milestones
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {[
                                { event: '100th Learner Enrolled', time: '2h ago', color: 'bg-primary-500' },
                                { event: 'JavaScript Basics hit 90% completion', time: '5h ago', color: 'bg-green-500' },
                                { event: 'New Doubt Received', time: 'Yesterday', color: 'bg-yellow-500' },
                                { event: 'Monthly Report Generated', time: '2 days ago', color: 'bg-blue-500' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${item.color}`} />
                                    <div>
                                        <div className="text-sm text-white font-medium">{item.event}</div>
                                        <div className="text-xs text-gray-500">{item.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
