import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { lessonAPI } from '../../api/lesson.api';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Save, Trash, FileText, Video, Image } from 'lucide-react';

const LessonForm = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const { isInstructor, isAdmin } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        unitTitle: '',
        description: '',
        content: '',
        type: 'VIDEO', // Default to VIDEO
        duration: 10,
        order: 0,
        manualContent: ''
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!lessonId);
    const [error, setError] = useState('');

    const isEditMode = !!lessonId;

    useEffect(() => {
        if (!isInstructor && !isAdmin) {
            navigate(`/courses/${courseId}`);
            return;
        }

        if (isEditMode) {
            fetchLessonData();
        }
    }, [lessonId, isInstructor, isAdmin, courseId]);

    const fetchLessonData = async () => {
        try {
            setFetching(true);
            const response = await lessonAPI.getById(lessonId);
            const lesson = response.data.data;
            setFormData({
                title: lesson.title || '',
                unitTitle: lesson.unitTitle || '',
                description: lesson.description || '',
                content: lesson.content || '',
                type: lesson.type === 'DOCUMENT' && lesson.structuredContent ? 'PDF' : (lesson.type || 'VIDEO'),
                duration: lesson.duration || 10,
                order: lesson.order || 0,
                manualContent: lesson.structuredContent?.manualContent || ''
            });
        } catch (err) {
            setError('Failed to load lesson details.');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.type !== 'PDF' && (!formData.title.trim() || !formData.content.trim())) {
            setError('Title and content URL/Text are required.');
            return;
        }

        if (formData.type === 'PDF' && !formData.file && !formData.manualContent && !isEditMode) {
            setError('Please upload a PDF file or enter manual content.');
            return;
        }

        try {
            setLoading(true);
            let payload;

            if (formData.type === 'PDF' && formData.file) {
                payload = new FormData();
                payload.append('title', formData.title);
                payload.append('unitTitle', formData.unitTitle || '');
                payload.append('description', formData.description || '');
                payload.append('content', 'file_upload'); // placeholder
                payload.append('type', 'PDF');
                payload.append('order', formData.order);
                payload.append('duration', formData.duration);
                payload.append('courseId', courseId);
                payload.append('manualContent', formData.manualContent || '');
                if (formData.file) payload.append('file', formData.file);
            } else if (formData.type === 'PDF' && formData.manualContent) {
                // Case: Manual content only (no file)
                payload = new FormData(); // Use FormData for consistency or JSON? 
                // Backend expects multipart if file is involved, but here no file.
                // However, lesson.controller expects body fields.
                // Ideally use JSON if no file, but let's stick to consistency if controller handles it.
                // Actually, if no file, controller checks req.body.
                // But handleSubmit logic splits:

                // If types match consistency, use JSON:
                payload = { ...formData, courseId: parseInt(courseId) };
            } else {
                payload = { ...formData, courseId: parseInt(courseId) };
            }

            if (isEditMode) {
                await lessonAPI.update(lessonId, payload);
            } else {
                await lessonAPI.create(payload);
            }
            navigate(`/courses/${courseId}`);
        } catch (err) {
            console.error('❌ Lesson creation failed:', err);
            console.error('❌ Error response:', err.response?.data);
            console.error('❌ Error message:', err.response?.data?.message);
            setError(err.response?.data?.message || 'Failed to save lesson.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this lesson?')) {
            return;
        }

        try {
            setLoading(true);
            await lessonAPI.delete(lessonId);
            navigate(`/courses/${courseId}`);
        } catch (err) {
            setError('Failed to delete lesson.');
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
                onClick={() => navigate(`/courses/${courseId}`)}
                className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
            </button>

            <div className="card-solid">
                <div className="flex items-center justify-between mb-6 border-b border-dark-700 pb-4">
                    <h1 className="text-2xl font-bold text-white">
                        {isEditMode ? 'Edit Lesson' : 'Add New Lesson'}
                    </h1>
                    {isEditMode && (
                        <button
                            onClick={handleDelete}
                            className="btn-danger text-sm px-4 py-2 flex items-center"
                            type="button"
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete Lesson
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
                            Lesson Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Introduction to React"
                            className="input-field"
                            required
                        />
                    </div>

                    {/* Unit Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Unit / Section Title
                        </label>
                        <input
                            type="text"
                            name="unitTitle"
                            value={formData.unitTitle}
                            onChange={handleChange}
                            placeholder="e.g. Unit 1: Introduction, Section A: Basics"
                            className="input-field"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Group lessons into units or sections (optional).
                        </p>
                    </div>

                    {/* Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Lesson Type <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {(() => {
                                const types = [
                                    { id: 'PDF', label: '📄 PDF Upload', icon: FileText, highlight: true },
                                    { id: 'VIDEO', label: 'Video URL', icon: Video },
                                    { id: 'DOCUMENT', label: 'Document / Text', icon: FileText },
                                    { id: 'IMAGE', label: 'Image URL', icon: Image }
                                ];
                                console.log('🎨 Rendering lesson types:', types.map(t => t.label));
                                console.log('📄 PDF Upload is option #1');
                                return types.map(type => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => {
                                            console.log('✅ Selected type:', type.label, type.id);
                                            setFormData(prev => ({ ...prev, type: type.id }));
                                        }}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.type === type.id
                                            ? 'bg-primary-500/20 border-primary-500 text-white shadow-glow'
                                            : type.highlight
                                                ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20'
                                                : 'bg-dark-800 border-dark-700 text-gray-400 hover:bg-dark-750'
                                            }`}
                                    >
                                        <type.icon className={`w-6 h-6 mb-2 ${formData.type === type.id ? 'text-primary-400' : type.highlight ? 'text-yellow-400' : 'text-gray-500'}`} />
                                        <span className="text-sm font-medium">{type.label}</span>
                                        {type.highlight && <span className="text-xs text-yellow-400 mt-1">← Recommended</span>}
                                    </button>
                                ));
                            })()}
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Content Value <span className="text-red-400">*</span>
                        </label>
                        {formData.type === 'DOCUMENT' ? (
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="8"
                                placeholder="Markdown content or plain text..."
                                className="input-field font-mono text-sm"
                                required
                            />
                        ) : formData.type === 'PDF' ? (
                            <>
                                <div className="border-2 border-dashed border-dark-600 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files[0] }))}
                                        className="hidden"
                                        id="pdf-upload"
                                    />
                                    <label htmlFor="pdf-upload" className="cursor-pointer">
                                        <div className="text-gray-400">
                                            {formData.file ? (
                                                <div className="text-primary-400 font-semibold">{formData.file.name}</div>
                                            ) : (
                                                <>
                                                    <div className="text-lg font-medium text-white mb-2">Click to upload PDF</div>
                                                    <div className="text-sm">or drag and drop here</div>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                    {isEditMode && !formData.file && (
                                        <div className="mt-4 text-xs text-gray-500">
                                            Current file: {formData.content || 'None'}
                                        </div>
                                    )}
                                </div>

                                {/* Manual Content Area for PDF Fallback/Override */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Manual Lesson Content (Overrides PDF)
                                    </label>
                                    <textarea
                                        name="manualContent"
                                        value={formData.manualContent || ''}
                                        onChange={handleChange}
                                        rows="10"
                                        placeholder="# Lesson Content&#10;Paste your lesson text here as a backup or primary content..."
                                        className="input-field font-mono text-sm"
                                    />
                                    <p className="text-xs text-yellow-500 mt-1">
                                        * If provided, this text will take priority over the PDF extraction.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <input
                                type="url"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder={formData.type === 'VIDEO' ? "https://youtube.com/watch?v=..." : "https://example.com/image.jpg"}
                                className="input-field"
                                required={formData.type !== 'PDF'}
                            />
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.type === 'VIDEO'
                                ? 'Provide a direct link or YouTube URL.'
                                : formData.type === 'IMAGE'
                                    ? 'Provide a direct image URL.'
                                    : formData.type === 'PDF'
                                        ? 'Upload a PDF file to extract content from.'
                                        : 'Enter text content.'}
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Short Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Brief summary of this lesson..."
                            className="input-field resize-none"
                        />
                    </div>

                    {/* Duration & Order */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Duration (minutes)
                            </label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                min="1"
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Order Sequence
                            </label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                min="0"
                                className="input-field"
                                placeholder="Auto-assigned if empty"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-dark-700">
                        <button
                            type="button"
                            onClick={() => navigate(`/courses/${courseId}`)}
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
                                    {isEditMode ? 'Update Lesson' : 'Create Lesson'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LessonForm;
