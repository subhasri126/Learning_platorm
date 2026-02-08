import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courseAPI } from '../../api/course.api';
import { ArrowLeft, Users, BarChart3, TrendingUp, Award, Clock } from 'lucide-react';
import Loading from '../../components/common/Loading';

const CourseStats = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await courseAPI.getById(id);
                setCourse(response.data.data);
            } catch (err) {
                setError('Failed to load course statistics.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [id]);

    if (loading) return <Loading />;
    if (error) return <div className="p-8 text-red-400">{error}</div>;
    if (!course) return <div className="p-8 text-gray-400 text-center">Course not found.</div>;

    const stats = [
        { label: 'Total Students', value: course._count?.enrollments || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Completion Rate', value: '68%', icon: BarChart3, color: 'text-green-400', bg: 'bg-green-500/10' },
        { label: 'Average Quiz Score', value: '82%', icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { label: 'Avg. Finish Time', value: '45m', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ];

    return (
        <div className="min-h-screen bg-dark-900 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <Link to="/instructor/dashboard" className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">{course.title} Analytics</h1>
                    <p className="text-gray-400">Deep dive into learner performance and engagement metrics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="card-solid flex items-center gap-6"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
                                <div className="text-3xl font-black text-white">{stat.value}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 card-solid">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-500" />
                            Enrollment Growth
                        </h2>
                        <div className="h-64 bg-dark-800/50 rounded-xl border border-dark-700 flex items-center justify-center text-gray-500 italic">
                            [ Interactive Graph Component Placeholder ]
                        </div>
                    </div>

                    <div className="card-solid">
                        <h2 className="text-xl font-bold text-white mb-6">Module Activity</h2>
                        <div className="space-y-4">
                            {course.lessons.slice(0, 5).map((lesson, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                                    <span className="text-sm text-gray-300 truncate pr-4">{lesson.title}</span>
                                    <span className="text-xs font-bold text-primary-400">92% Reach</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseStats;
