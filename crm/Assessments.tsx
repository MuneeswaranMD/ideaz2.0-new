
import React, { useState, useEffect } from 'react';
import { getCourses, createAssessment, getAssessments, Course, Assessment } from '../services/lmsService';
import { Plus, Trash2, CheckCircle, HelpCircle } from 'lucide-react';

const Assessments: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [showModal, setShowModal] = useState(false);

    // New Assessment Form State
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState<{ question: string, options: string[], correctAnswer: number }[]>([
        { question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            loadAssessments(selectedCourseId);
        } else {
            setAssessments([]);
        }
    }, [selectedCourseId]);

    const loadCourses = async () => {
        const data = await getCourses();
        setCourses(data);
    };

    const loadAssessments = async (courseId: string) => {
        const data = await getAssessments(courseId);
        setAssessments(data);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    };

    const handleQuestionChange = (index: number, field: string, value: any) => {
        const newQuestions = [...questions];
        if (field === 'question') newQuestions[index].question = value;
        if (field === 'correctAnswer') newQuestions[index].correctAnswer = parseInt(value);
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleSave = async () => {
        if (!selectedCourseId) return alert("Please select a course first");
        if (!title) return alert("Title is required");

        const newAssessment: Assessment = {
            courseId: selectedCourseId,
            title,
            questions
        };

        await createAssessment(newAssessment);
        setShowModal(false);
        setTitle('');
        setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
        loadAssessments(selectedCourseId);
    };

    return (
        <div className="p-10 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">Assessments</h1>
                    <p className="text-gray-400">Create quizzes and tests for your courses.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2"
                >
                    <Plus size={20} /> Create Assessment
                </button>
            </header>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Select Course</label>
                <select
                    className="w-full md:w-1/3 bg-black/50 text-white p-3 rounded-xl border border-white/10 outline-none focus:border-indigo-500"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                    <option value="">-- Select a Course --</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments.map(a => (
                    <div key={a.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
                                <CheckCircle size={20} />
                            </div>
                            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-gray-400">{a.questions.length} Qs</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{a.title}</h3>
                        <p className="text-sm text-gray-500 truncate">Course ID: {a.courseId}</p>
                    </div>
                ))}
                {assessments.length === 0 && selectedCourseId && (
                    <div className="col-span-full text-center py-10 text-gray-500">No assessments found for this course.</div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">New Assessment</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-2">Assessment Title</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500"
                                    placeholder="e.g. React Hooks Quiz"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-6">
                                {questions.map((q, qIndex) => (
                                    <div key={qIndex} className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="flex justify-between mb-4">
                                            <span className="text-sm font-bold text-indigo-400 uppercase">Question {qIndex + 1}</span>
                                            {questions.length > 1 && (
                                                <button
                                                    onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))}
                                                    className="text-red-500 hover:text-white"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white mb-4 outline-none"
                                            placeholder="Enter question text..."
                                            value={q.question}
                                            onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            {q.options.map((opt, oIndex) => (
                                                <div key={oIndex} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={`q-${qIndex}`}
                                                        checked={q.correctAnswer === oIndex}
                                                        onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                                                        className="accent-indigo-500"
                                                    />
                                                    <input
                                                        className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none focus:border-white/20"
                                                        placeholder={`Option ${oIndex + 1}`}
                                                        value={opt}
                                                        onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={handleAddQuestion} className="w-full py-3 bg-white/5 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-white/50 transition-all font-bold flex items-center justify-center gap-2">
                                <Plus size={18} /> Add Question
                            </button>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <button onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-400 hover:text-white font-bold">Cancel</button>
                                <button onClick={handleSave} className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Save Quiz</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assessments;
