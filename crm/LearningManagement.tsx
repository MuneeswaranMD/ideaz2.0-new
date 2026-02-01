
import React, { useState, useEffect } from 'react';
import {
    getCourses, createCourse, updateCourse, deleteCourse,
    getModules, createModule, updateModule, deleteModule,
    getLessons, createLesson, updateLesson, deleteLesson,
    getSchools, createSchool, updateSchool, deleteSchool,
    Course, Module, Lesson, School
} from '../services/lmsService';
import { BookOpen, Video, FileText, Plus, Trash2, Edit2, ArrowLeft, ChevronRight, PlayCircle, MoreVertical, Image as ImageIcon, Loader, School as SchoolIcon } from 'lucide-react';
import { uploadToCloudinary } from '../lib/uploadService';

const LearningManagement: React.FC = () => {
    // Navigation State
    const [view, setView] = useState<'courses' | 'course_detail' | 'schools'>('courses');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);

    // Data State
    const [courses, setCourses] = useState<Course[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [showSchoolModal, setShowSchoolModal] = useState(false);

    // Editor State
    const [courseData, setCourseData] = useState<Partial<Course>>({ title: '', description: '', price: 0 });
    const [moduleData, setModuleData] = useState<Partial<Module>>({ title: '', order: 0 });
    const [lessonData, setLessonData] = useState<Partial<Lesson>>({ title: '', videoUrl: '', content: '', order: 0 });
    const [schoolData, setSchoolData] = useState<Partial<School>>({ name: '', address: '', contactEmail: '', adminName: '' });

    useEffect(() => {
        loadCourses();
        loadSchools();
    }, []);

    const loadSchools = async () => {
        try {
            const data = await getSchools();
            setSchools(data as School[]);
        } catch (err) {
            console.error("Failed to load schools", err);
        }
    };

    useEffect(() => {
        if (selectedCourse?.id) {
            loadModules(selectedCourse.id);
        }
    }, [selectedCourse]);

    useEffect(() => {
        if (selectedModule?.id) {
            loadLessons(selectedModule.id);
        }
    }, [selectedModule]);

    // --- Loaders ---
    const loadCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCourses();
            setCourses(data);
        } catch (err: any) {
            console.error("Failed to load courses:", err);
            setError("Failed to load courses. Ensure you have permission.");
        }
        setLoading(false);
    };

    const loadModules = async (courseId: string) => {
        setLoading(true);
        try {
            const data = await getModules(courseId);
            setModules(data);
        } catch (err: any) {
            console.error("Failed to load modules:", err);
            // Don't block UI for specific section fail, but maybe alert
        }
        setLoading(false);
    };

    const loadLessons = async (moduleId: string) => {
        try {
            const data = await getLessons(moduleId);
            setLessons(data);
        } catch (err: any) {
            console.error("Failed to load lessons:", err);
        }
    };

    // --- Handlers ---
    const handleSaveCourse = async () => {
        if (courseData.id) {
            await updateCourse(courseData.id, courseData);
        } else {
            await createCourse(courseData as Course);
        }
        setShowCourseModal(false);
        setCourseData({ title: '', description: '', price: 0 });
        loadCourses();
    };

    const handleSaveModule = async () => {
        if (!selectedCourse?.id) return;
        if (moduleData.id) {
            await updateModule(moduleData.id, moduleData);
        } else {
            await createModule({ ...moduleData, courseId: selectedCourse.id } as Module);
        }
        setShowModuleModal(false);
        setModuleData({ title: '', order: modules.length + 1 });
        loadModules(selectedCourse.id);
    };

    const handleSaveLesson = async () => {
        if (!selectedModule?.id || !selectedCourse?.id) return;
        if (lessonData.id) {
            await updateLesson(lessonData.id, lessonData);
        } else {
            await createLesson({
                ...lessonData,
                moduleId: selectedModule.id,
                courseId: selectedCourse.id
            } as Lesson);
        }
        setShowLessonModal(false);
        setLessonData({ title: '', videoUrl: '', content: '', order: lessons.length + 1 });
        loadLessons(selectedModule.id);
    };

    const handleDeleteCourse = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Delete this course? This cannot be undone.")) return;
        await deleteCourse(id);
        loadCourses();
    };

    const handleDeleteModule = async (id: string) => {
        if (!confirm("Delete module?")) return;
        await deleteModule(id);
        if (selectedCourse?.id) loadModules(selectedCourse.id);
    };

    const handleDeleteLesson = async (id: string) => {
        if (!confirm("Delete lesson?")) return;
        await deleteLesson(id);
        if (selectedModule?.id) loadLessons(selectedModule.id);
    };

    const handleSaveSchool = async () => {
        if (!schoolData.name) return alert("Name required");
        try {
            if (schoolData.id) {
                await updateSchool(schoolData.id, schoolData);
            } else {
                await createSchool(schoolData as School);
            }
            setShowSchoolModal(false);
            loadSchools();
            setSchoolData({ name: '', address: '', contactEmail: '', adminName: '' });
        } catch (err) {
            console.error(err);
            alert("Error saving school");
        }
    };

    const handleDeleteSchool = async (id: string) => {
        if (!confirm("Delete this school?")) return;
        await deleteSchool(id);
        loadSchools();
    };


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            setError(null);
            const file = e.target.files[0];
            try {
                // Use Cloudinary for upload
                const url = await uploadToCloudinary(file);
                setCourseData(prev => ({ ...prev, thumbnail: url }));
            } catch (err: any) {
                console.error("Upload failed", err);
                const msg = err.message || "Upload failed";
                if (msg.includes("Cloudinary not configured")) {
                    alert("Please configure Cloudinary credentials in lib/uploadService.ts");
                } else {
                    setError("Upload failed. Use the URL paste option if this persists.");
                }
            }
            setUploading(false);
        }
    };

    // --- Renderers ---

    const renderCoursesList = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Header Actions */}
            <div className="col-span-full flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <button onClick={() => setView('courses')} className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${view === 'courses' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>Courses</button>
                    <button onClick={() => setView('schools')} className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${view === 'schools' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>Schools</button>
                </div>
                <button onClick={() => { setCourseData({}); setShowCourseModal(true); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20">
                    <Plus size={18} />
                    New Course
                </button>
            </div>

            {courses.map(course => (
                <div key={course.id} className="glass-card p-6 rounded-3xl border border-white/5 hover:border-indigo-500/50 transition-all group cursor-pointer relative" onClick={() => { setSelectedCourse(course); setView('course_detail'); }}>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setCourseData(course); setShowCourseModal(true); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                            <Edit2 size={18} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); course.id && handleDeleteCourse(course.id); }} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg">
                            <Trash2 size={18} />
                        </button>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-500 mb-4 overflow-hidden">
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                            <BookOpen size={24} />
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{course.description}</p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 uppercase font-bold tracking-wider">
                        <span>{course.price ? `$${course.price}` : 'Free'}</span>
                        <span>Multi-Module</span>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSchoolsList = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Header Actions */}
            <div className="col-span-full flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <button onClick={() => setView('courses')} className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${view === 'courses' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>Courses</button>
                    <button onClick={() => setView('schools')} className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${view === 'schools' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>Schools</button>
                </div>
                <button onClick={() => { setSchoolData({}); setShowSchoolModal(true); }} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
                    <Plus size={18} />
                    Add School
                </button>
            </div>

            {schools.map(school => (
                <div key={school.id} className="glass-card p-6 rounded-3xl border border-white/5 hover:border-emerald-500/50 transition-all group relative">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button onClick={() => { setSchoolData(school); setShowSchoolModal(true); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                            <Edit2 size={18} />
                        </button>
                        <button onClick={() => school.id && handleDeleteSchool(school.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg">
                            <Trash2 size={18} />
                        </button>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-500 mb-4">
                        <SchoolIcon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{school.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{school.address}</p>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Admin:</span>
                            <span className="text-white font-medium">{school.adminName}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Contact:</span>
                            <span className="text-white font-medium">{school.contactEmail}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderCourseDetail = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => { setView('courses'); setSelectedCourse(null); setSelectedModule(null); }}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-3xl font-black text-white">{selectedCourse?.title}</h2>
                    <p className="text-gray-400">{selectedCourse?.description}</p>
                </div>
                <div className="ml-auto">
                    <button
                        onClick={() => { setCourseData(selectedCourse!); setShowCourseModal(true); }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm"
                    >
                        Edit Details
                    </button>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Modules Sidebar */}
                <div className="w-1/3 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Modules</h3>
                        <button
                            onClick={() => { setModuleData({ order: modules.length + 1 }); setShowModuleModal(true); }}
                            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {modules.map(mod => (
                            <div
                                key={mod.id}
                                onClick={() => setSelectedModule(mod)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedModule?.id === mod.id
                                    ? 'bg-indigo-600 text-white border-indigo-500'
                                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">{mod.title}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                                        {/* Actions could go here */}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {modules.length === 0 && <div className="text-sm text-gray-500 italic">No modules yet.</div>}
                    </div>
                </div>

                {/* Lessons Content */}
                <div className="flex-1 bg-white/5 rounded-3xl p-8 border border-white/5 min-h-[500px]">
                    {selectedModule ? (
                        <>
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Current Module</span>
                                    <h3 className="text-2xl font-black text-white">{selectedModule.title}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDeleteModule(selectedModule.id!)}
                                        className="text-red-500 hover:text-red-400 font-bold text-sm px-3"
                                    >
                                        Delete Module
                                    </button>
                                    <button
                                        onClick={() => { setLessonData({ order: lessons.length + 1 }); setShowLessonModal(true); }}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add Lesson
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {lessons.map(lesson => (
                                    <div key={lesson.id} className="group flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-indigo-400">
                                                {lesson.videoUrl ? <Video size={20} /> : <FileText size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{lesson.title}</h4>
                                                <p className="text-xs text-gray-500 truncate max-w-md">{lesson.videoUrl || 'Text Content'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setLessonData(lesson); setShowLessonModal(true); }}
                                                className="p-2 text-gray-400 hover:text-white"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteLesson(lesson.id!)}
                                                className="p-2 text-red-500 hover:text-red-400"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {lessons.length === 0 && <div className="text-center text-gray-500 py-10">No lessons in this module.</div>}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <BookOpen size={48} className="mb-4 opacity-20" />
                            <p>Select a module to manage lessons</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-10 min-h-screen">
            <header className="mb-8">
                <h1 className="text-4xl font-black text-white mb-2">LMS Admin</h1>
                <p className="text-gray-400">Manage your AI-powered courses and curriculum.</p>
                {error && <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 font-bold">{error}</div>}
            </header>

            {view === 'courses' ? renderCoursesList() : view === 'schools' ? renderSchoolsList() : renderCourseDetail()}

            {/* Modals */}
            {showSchoolModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6 underline decoration-indigo-500">School Details</h2>
                        <input className="w-full bg-white/5 mb-4 p-3 rounded-xl text-white outline-none focus:ring-2 ring-indigo-500" placeholder="School Name" value={schoolData.name} onChange={e => setSchoolData({ ...schoolData, name: e.target.value })} />
                        <input className="w-full bg-white/5 mb-4 p-3 rounded-xl text-white outline-none focus:ring-2 ring-indigo-500" placeholder="Address" value={schoolData.address} onChange={e => setSchoolData({ ...schoolData, address: e.target.value })} />
                        <input className="w-full bg-white/5 mb-4 p-3 rounded-xl text-white outline-none focus:ring-2 ring-indigo-500" placeholder="Contact Email" value={schoolData.contactEmail} onChange={e => setSchoolData({ ...schoolData, contactEmail: e.target.value })} />
                        <input className="w-full bg-white/5 mb-4 p-3 rounded-xl text-white outline-none focus:ring-2 ring-indigo-500" placeholder="Admin Name" value={schoolData.adminName} onChange={e => setSchoolData({ ...schoolData, adminName: e.target.value })} />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowSchoolModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                            <button onClick={handleSaveSchool} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Save School</button>
                        </div>
                    </div>
                </div>
            )}

            {showCourseModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">{courseData.id ? 'Edit Course' : 'New Course'}</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Course Thumbnail</label>
                            <div className="flex items-center gap-4">
                                {courseData.thumbnail ? (
                                    <img src={courseData.thumbnail} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-white/10" />
                                ) : (
                                    <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                                        <ImageIcon size={24} />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 w-fit transition-all">
                                        {uploading ? <Loader className="animate-spin" size={16} /> : <ImageIcon size={16} />}
                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">Recommended: 1280x720 (16:9)</p>
                                </div>
                            </div>
                        </div>

                        <input className="w-full bg-white/5 mb-4 p-3 rounded-xl text-white outline-none focus:ring-2 ring-indigo-500" placeholder="Course Title" value={courseData.title} onChange={e => setCourseData({ ...courseData, title: e.target.value })} />
                        <textarea className="w-full bg-white/5 mb-4 p-3 rounded-xl text-white outline-none focus:ring-2 ring-indigo-500 h-24" placeholder="Description" value={courseData.description} onChange={e => setCourseData({ ...courseData, description: e.target.value })} />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowCourseModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                            <button onClick={handleSaveCourse} disabled={uploading} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {showModuleModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Module Details</h2>
                        <input className="w-full bg-white/5 mb-4 p-3 rounded-xl text-white outline-none focus:ring-2 ring-indigo-500" placeholder="Module Title" value={moduleData.title} onChange={e => setModuleData({ ...moduleData, title: e.target.value })} />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowModuleModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                            <button onClick={handleSaveModule} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {showLessonModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card w-full max-w-lg p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Lesson Content</h2>
                        <input className="w-full bg-white/5 mb-4 p-3 rounded-xl text-white outline-none focus:ring-2 ring-indigo-500" placeholder="Lesson Title" value={lessonData.title} onChange={e => setLessonData({ ...lessonData, title: e.target.value })} />
                        <input className="w-full bg-white/5 mb-4 p-3 rounded-xl text-white outline-none focus:ring-2 ring-indigo-500" placeholder="Video URL (YouTube)" value={lessonData.videoUrl} onChange={e => setLessonData({ ...lessonData, videoUrl: e.target.value })} />
                        <textarea className="w-full bg-white/5 mb-4 p-3 rounded-xl text-white outline-none focus:ring-2 ring-indigo-500 h-32" placeholder="Lesson Content / Transcript for AI" value={lessonData.content} onChange={e => setLessonData({ ...lessonData, content: e.target.value })} />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowLessonModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                            <button onClick={handleSaveLesson} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Save Lesson</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearningManagement;
