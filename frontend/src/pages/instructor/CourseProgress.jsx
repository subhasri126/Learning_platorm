import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courseAPI } from '../../api/course.api';
import { ArrowLeft, User, Search, Filter, Download } from 'lucide-react';
import Loading from '../../components/common/Loading';

const CourseProgress = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await courseAPI.getById(id);
                setCourse(response.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <Loading />;
    if (!course) return <div className="p-8 text-center text-white">Course not found</div>;

    // Mock student data for demonstration
    const students = [
        { name: 'Alex Thompson', progress: 85, lastActive: '2 min ago', grades: 'A' },
        { name: 'Sarah Miller', progress: 42, lastActive: '1h ago', grades: 'B' },
        { name: 'Michael Chen', progress: 100, lastActive: 'Yesterday', grades: 'A+' },
        { name: 'Emma Davis', progress: 12, lastActive: '3 days ago', grades: 'C' },
    ];

    return (
        <div className="min-h-screen bg-dark-900 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <Link to="/instructor/dashboard" className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Learner Progress</h1>
                        <p className="text-gray-400">Detailed performance tracking for <span className="text-primary-400 font-bold">{course.title}</span>.</p>
                    </div>

                    <div className="flex gap-3">
                        <button className="btn-secondary flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="card-solid mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Filter by name or email..."
                            className="bg-dark-800 border border-dark-700 text-white p-3 pl-10 rounded-xl w-full outline-none focus:border-primary-500 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="w-full md:w-auto px-6 py-3 bg-dark-800 border border-dark-700 text-gray-300 rounded-xl flex items-center justify-center gap-2 hover:bg-dark-700 transition-colors">
                        <Filter className="w-4 h-4" />
                        Options
                    </button>
                </div>

                <div className="card-solid overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-dark-800/50 border-b border-dark-700">
                                    <th className="p-6 text-xs font-black uppercase text-gray-500 tracking-widest">Learner</th>
                                    <th className="p-6 text-xs font-black uppercase text-gray-500 tracking-widest">Mastery</th>
                                    <th className="p-6 text-xs font-black uppercase text-gray-500 tracking-widest">Last Activity</th>
                                    <th className="p-6 text-xs font-black uppercase text-gray-500 tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {students.map((student, idx) => (
                                    <motion.tr
                                        key={idx}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-dark-800/40 transition-colors"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary-400" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">{student.name}</div>
                                                    <div className="text-xs text-gray-500">Student ID: #ST-00{idx + 10}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 h-2 bg-dark-800 rounded-full max-w-[150px] overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
                                                        style={{ width: `${student.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-black text-white">{student.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-sm text-gray-400">
                                            {student.lastActive}
                                        </td>
                                        <td className="p-6 text-right">
                                            <button className="text-xs font-bold text-primary-500 hover:text-white transition-colors">
                                                VIEW DETAILED LOGS
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseProgress;
