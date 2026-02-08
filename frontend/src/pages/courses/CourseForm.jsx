import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseAPI } from '../../api/course.api';
import { lessonAPI } from '../../api/lesson.api';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Save, Trash, Image as ImageIcon, FileText, Upload, X } from 'lucide-react';

const CourseForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isInstructor, isAdmin } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: '',
        isPublished: false,
        pdfLessons: []
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);
    const [error, setError] = useState('');

    const isEditMode = !!id;

    useEffect(() => {
        // If not authorized, redirect
        if (!isInstructor && !isAdmin) {
            navigate('/courses');
            return;
        }

        if (isEditMode) {
            fetchCourseData();
        }
    }, [id, isInstructor, isAdmin]);

    const fetchCourseData = async () => {
        try {
            setFetching(true);
            const response = await courseAPI.getById(id);
            const course = response.data.data;
            setFormData({
                title: course.title || '',
                description: course.description || '',
                thumbnail: course.thumbnail || '',
                isPublished: course.isPublished || false
            });
        } catch (err) {
            setError('Failed to load course details.');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim() || !formData.description.trim()) {
            setError('Title and description are required.');
            return;
        }

        try {
            setLoading(true);
            let courseId = id;

            if (isEditMode) {
                await courseAPI.update(id, formData);
            } else {
                const response = await courseAPI.create(formData);
                courseId = response.data.data.id;
            }

            // Upload PDF lessons if any
            if (formData.pdfLessons.length > 0 && !isEditMode) {
                console.log(`📄 Uploading ${formData.pdfLessons.length} PDF lessons...`);

                for (let i = 0; i < formData.pdfLessons.length; i++) {
                    const pdfLesson = formData.pdfLessons[i];
                    const formDataToSend = new FormData();

                    formDataToSend.append('title', pdfLesson.title);
                    formDataToSend.append('description', `PDF lesson: ${pdfLesson.title}`);
                    formDataToSend.append('content', 'file_upload');
                    formDataToSend.append('type', 'PDF');
                    formDataToSend.append('duration', '15');
                    formDataToSend.append('order', i + 1);
                    formDataToSend.append('courseId', courseId);
                    formDataToSend.append('file', pdfLesson.file);

                    try {
                        await lessonAPI.create(formDataToSend);
                        console.log(`✅ Uploaded: ${pdfLesson.title}`);
                    } catch (lessonError) {
                        console.error(`❌ Failed to upload ${pdfLesson.title}:`, lessonError);
                    }
                }

                console.log('✅ All PDF lessons uploaded!');
            }

            navigate('/courses');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save course.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this course? This cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);
            await courseAPI.delete(id);
            navigate('/courses');
        } catch (err) {
            setError('Failed to delete course.');
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/courses')}
                className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
            </button>

            <div className="card-solid">
                <div className="flex items-center justify-between mb-6 border-b border-dark-700 pb-4">
                    <h1 className="text-2xl font-bold text-white">
                        {isEditMode ? 'Edit Course' : 'Create New Course'}
                    </h1>
                    {isEditMode && (
                        <button
                            onClick={handleDelete}
                            className="btn-danger text-sm px-4 py-2 flex items-center"
                            type="button"
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete Course
                        </button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Course Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Advanced React Patterns"
                            className="input-field"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Detailed description of what students will learn..."
                            className="input-field resize-none"
                            required
                        />
                    </div>

                    {/* Thumbnail URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Thumbnail URL (Optional)
                        </label>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="url"
                                    name="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="input-field"
                                />
                            </div>
                            {formData.thumbnail && (
                                <div className="w-20 h-12 bg-dark-900 rounded-lg overflow-hidden border border-dark-700 flex-shrink-0">
                                    <img
                                        src={formData.thumbnail}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PDF Lessons Upload Section */}
                    <div className="border-2 border-yellow-500/30 rounded-xl p-6 bg-yellow-500/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">📄 Add PDF Lessons (Optional)</h3>
                                <p className="text-sm text-gray-400">Upload PDF files to create lessons automatically</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-yellow-500/50 rounded-xl p-6 text-center hover:border-yellow-500 transition-colors bg-dark-900/50">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        const newLessons = files.map(file => ({
                                            file,
                                            title: file.name.replace('.pdf', ''),
                                            id: Math.random().toString(36).substr(2, 9)
                                        }));
                                        setFormData(prev => ({
                                            ...prev,
                                            pdfLessons: [...prev.pdfLessons, ...newLessons]
                                        }));
                                        e.target.value = '';
                                    }}
                                    className="hidden"
                                    id="pdf-upload-course"
                                />
                                <label htmlFor="pdf-upload-course" className="cursor-pointer">
                                    <Upload className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                                    <div className="text-lg font-medium text-white mb-2">Click to upload PDF files</div>
                                    <div className="text-sm text-gray-400">or drag and drop here</div>
                                    <div className="text-xs text-gray-500 mt-2">You can select multiple PDF files at once</div>
                                </label>
                            </div>

                            {formData.pdfLessons && formData.pdfLessons.length > 0 && (
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-gray-300">
                                        {formData.pdfLessons.length} PDF lesson{formData.pdfLessons.length > 1 ? 's' : ''} ready to upload
                                    </div>
                                    {formData.pdfLessons.map((lesson, index) => (
                                        <div key={lesson.id} className="bg-dark-800/60 rounded-lg p-4 border border-dark-700">
                                            <div className="flex items-start gap-3">
                                                <FileText className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                                                <div className="flex-1 min-w-0">
                                                    <input
                                                        type="text"
                                                        value={lesson.title}
                                                        onChange={(e) => {
                                                            const updated = [...formData.pdfLessons];
                                                            updated[index].title = e.target.value;
                                                            setFormData(prev => ({ ...prev, pdfLessons: updated }));
                                                        }}
                                                        placeholder="Lesson title"
                                                        className="input-field mb-2"
                                                    />
                                                    <div className="text-xs text-gray-500">
                                                        {lesson.file.name} ({(lesson.file.size / 1024).toFixed(2)} KB)
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            pdfLessons: prev.pdfLessons.filter(l => l.id !== lesson.id)
                                                        }));
                                                    }}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0"
                                                    title="Remove"
                                                >
                                                    <X className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="text-xs text-gray-500 bg-dark-900/50 p-3 rounded-lg">
                                <strong className="text-yellow-400">💡 Tip:</strong> PDF lessons will be created automatically after you save the course. You can edit them later from the course detail page.
                            </div>
                        </div>
                    </div>

                    {/* Publishing Status */}
                    <div className="flex items-center gap-3 p-4 bg-dark-900/50 rounded-xl border border-dark-700">
                        <input
                            type="checkbox"
                            id="isPublished"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-dark-600 text-primary-600 focus:ring-primary-500 bg-dark-800"
                        />
                        <div>
                            <label htmlFor="isPublished" className="font-medium text-white cursor-pointer select-none">
                                Publish Course
                            </label>
                            <p className="text-xs text-gray-400 mt-0.5">
                                If checked, this course will be visible to all learners immediately.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-dark-700">
                        <button
                            type="button"
                            onClick={() => navigate('/courses')}
                            className="btn-ghost"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {isEditMode ? 'Update Course' : 'Create Course'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseForm;
