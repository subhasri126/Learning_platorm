import React, { useState, useEffect } from 'react';
import { courseAPI } from '../api/course.api';
import axios from '../api/axios';

const DiagnosticPage = () => {
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        runDiagnostics();
    }, []);

    const runDiagnostics = async () => {
        const diagnostics = {};

        // Test 1: Check if token exists
        const token = localStorage.getItem('token');
        diagnostics.tokenExists = !!token;
        diagnostics.token = token ? `${token.substring(0, 20)}...` : 'No token';

        // Test 2: Check axios baseURL
        diagnostics.axiosBaseURL = axios.defaults.baseURL;

        // Test 3: Try to fetch courses
        try {
            const response = await courseAPI.getAll();
            diagnostics.coursesAPI = {
                success: true,
                status: response.status,
                dataType: typeof response.data,
                hasData: !!response.data.data,
                isArray: Array.isArray(response.data.data),
                count: Array.isArray(response.data.data) ? response.data.data.length : 0,
                courses: response.data.data
            };
        } catch (err) {
            diagnostics.coursesAPI = {
                success: false,
                error: err.message,
                response: err.response?.data,
                status: err.response?.status
            };
        }

        // Test 4: Direct fetch to backend
        try {
            const response = await fetch('http://localhost:5000/api/courses', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            diagnostics.directFetch = {
                success: response.ok,
                status: response.status,
                data: data
            };
        } catch (err) {
            diagnostics.directFetch = {
                success: false,
                error: err.message
            };
        }

        setResults(diagnostics);
        setLoading(false);
    };

    if (loading) {
        return <div className="p-8">Running diagnostics...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-white mb-6">🔍 Course System Diagnostics</h1>

            <div className="space-y-4">
                {/* Token Check */}
                <div className="card-solid">
                    <h2 className="text-xl font-semibold text-white mb-2">
                        1. Authentication Token
                    </h2>
                    <div className={`p-3 rounded ${results.tokenExists ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        <p className="text-white">
                            Status: {results.tokenExists ? '✅ Token exists' : '❌ No token found'}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">Token: {results.token}</p>
                    </div>
                </div>

                {/* Axios Config */}
                <div className="card-solid">
                    <h2 className="text-xl font-semibold text-white mb-2">
                        2. Axios Configuration
                    </h2>
                    <div className="p-3 rounded bg-blue-500/20">
                        <p className="text-white">Base URL: {results.axiosBaseURL || '/api (proxy)'}</p>
                    </div>
                </div>

                {/* Courses API Test */}
                <div className="card-solid">
                    <h2 className="text-xl font-semibold text-white mb-2">
                        3. Courses API (via axios)
                    </h2>
                    <div className={`p-3 rounded ${results.coursesAPI?.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {results.coursesAPI?.success ? (
                            <>
                                <p className="text-white">✅ API call successful</p>
                                <p className="text-gray-400">Status: {results.coursesAPI.status}</p>
                                <p className="text-gray-400">Is Array: {results.coursesAPI.isArray ? 'Yes' : 'No'}</p>
                                <p className="text-gray-400 font-bold text-lg">
                                    Courses Count: {results.coursesAPI.count}
                                </p>
                                {results.coursesAPI.count > 0 && (
                                    <div className="mt-3">
                                        <p className="text-white font-semibold">Courses:</p>
                                        <pre className="text-xs text-gray-300 mt-2 overflow-auto max-h-60 bg-dark-800 p-2 rounded">
                                            {JSON.stringify(results.coursesAPI.courses, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <p className="text-white">❌ API call failed</p>
                                <p className="text-gray-400">Error: {results.coursesAPI?.error}</p>
                                <p className="text-gray-400">Status: {results.coursesAPI?.status}</p>
                                {results.coursesAPI?.response && (
                                    <pre className="text-xs text-gray-300 mt-2">
                                        {JSON.stringify(results.coursesAPI.response, null, 2)}
                                    </pre>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Direct Fetch Test */}
                <div className="card-solid">
                    <h2 className="text-xl font-semibold text-white mb-2">
                        4. Direct Backend Fetch
                    </h2>
                    <div className={`p-3 rounded ${results.directFetch?.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {results.directFetch?.success ? (
                            <>
                                <p className="text-white">✅ Direct fetch successful</p>
                                <p className="text-gray-400">Status: {results.directFetch.status}</p>
                                <pre className="text-xs text-gray-300 mt-2 overflow-auto max-h-40 bg-dark-800 p-2 rounded">
                                    {JSON.stringify(results.directFetch.data, null, 2)}
                                </pre>
                            </>
                        ) : (
                            <>
                                <p className="text-white">❌ Direct fetch failed</p>
                                <p className="text-gray-400">Error: {results.directFetch?.error}</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="card-solid bg-yellow-500/10 border border-yellow-500/30">
                    <h2 className="text-xl font-semibold text-yellow-300 mb-2">
                        💡 Recommendations
                    </h2>
                    <div className="text-gray-300 space-y-2">
                        {!results.tokenExists && (
                            <p>• Please log in to get an authentication token</p>
                        )}
                        {results.coursesAPI?.success && results.coursesAPI?.count === 0 && (
                            <p>• No courses in database. Run: <code className="bg-dark-800 px-2 py-1 rounded">npm run seed</code> in backend</p>
                        )}
                        {!results.coursesAPI?.success && results.coursesAPI?.status === 401 && (
                            <p>• Token is invalid or expired. Please log in again</p>
                        )}
                        {!results.coursesAPI?.success && !results.directFetch?.success && (
                            <p>• Backend server might not be running. Check http://localhost:5000</p>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={runDiagnostics}
                className="btn-primary mt-6"
            >
                🔄 Re-run Diagnostics
            </button>
        </div>
    );
};

export default DiagnosticPage;
