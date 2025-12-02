"use client";

import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { 
  ChevronLeft, PlayCircle, CheckCircle, FileText, 
  Menu, X as CloseIcon, Video, CheckSquare, ArrowRight,
  AlertCircle, RotateCcw, Award, Lock, Star, Download
} from 'lucide-react';
import { Task, Question } from '@/lib/data';

// Extended Question type for frontend scrambling
interface ShuffledQuestion extends Question {
  scrambledOptions: string[];
  scrambledCorrectIndex: number;
}

export default function LearningPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { courses, enrollments, updateProgress, addReview, user } = useAppContext();
  
  const courseId = Number(id);
  const course = courses.find(c => c.id === courseId);
  const enrollment = enrollments.find(e => e.courseId === courseId);
  
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Quiz State
  const [viewingQuizId, setViewingQuizId] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [isRetake, setIsRetake] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);

  // Completion State
  const [showCompletion, setShowCompletion] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Sync initial module with saved progress
  useEffect(() => {
    if (enrollment) {
        if (enrollment.progress === 100) {
            setShowCompletion(true);
        } else {
            setActiveModuleIdx(enrollment.currentModuleIdx || 0);
        }
    }
  }, [enrollment]);

  const activeModule = course?.syllabus[activeModuleIdx];
  const activeQuiz = viewingQuizId && course ? course.tasks.find(t => t.id === viewingQuizId) : null;
  const currentExam = activeQuiz ? (isRetake ? activeQuiz.exams[1] : activeQuiz.exams[0]) : null;

  useEffect(() => {
    if (viewingQuizId && currentExam) {
        const scrambled = currentExam.questions.map(q => {
            const indices = q.options.map((_, i) => i);
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
            const newOptions = indices.map(i => q.options[i]);
            const newCorrect = indices.indexOf(q.correctAnswer);
            return { ...q, scrambledOptions: newOptions, scrambledCorrectIndex: newCorrect };
        });
        setShuffledQuestions(scrambled);
    }
  }, [viewingQuizId, isRetake, currentExam]);

  const handleModuleChange = (idx: number) => {
    const currentProgressIdx = enrollment?.currentModuleIdx || 0;
    if (idx > currentProgressIdx && enrollment?.progress !== 100) {
        alert("Harap selesaikan modul sebelumnya untuk membuka konten ini.");
        return;
    }
    setActiveModuleIdx(idx);
    resetQuizState();
    setShowCompletion(false);
    if (idx > currentProgressIdx) {
       updateProgress(courseId, idx);
    }
  };

  const resetQuizState = () => {
    setViewingQuizId(null);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const handleMarkAsDone = () => {
    if (!course) return;
    const currentModule = course.syllabus[activeModuleIdx];
    
    if (currentModule.linkedTaskId) {
        setViewingQuizId(currentModule.linkedTaskId);
    } else {
        const nextIdx = activeModuleIdx + 1;
        updateProgress(courseId, nextIdx); 
        
        if (nextIdx >= course.syllabus.length) {
            setShowCompletion(true);
        }
    }
  };

  const handleAnswerSelect = (questionId: number, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const submitQuiz = () => {
    if (!window.confirm("Apakah Anda yakin ingin mengirimkan jawaban Anda?")) return;
    
    let correctCount = 0;
    shuffledQuestions.forEach(q => {
        if (quizAnswers[q.id] === q.scrambledCorrectIndex) {
            correctCount++;
        }
    });

    const score = Math.round((correctCount / shuffledQuestions.length) * 100);
    const passingGrade = course?.passingGrade || 75;
    const passed = score >= passingGrade;

    setQuizResult({ score, passed });

    if (passed) {
        const nextIdx = activeModuleIdx + 1;
        updateProgress(courseId, nextIdx);
        if (nextIdx >= (course?.syllabus.length || 0)) {
            setShowCompletion(true);
        }
    }
  };

  const handleReviewMaterial = () => {
    setViewingQuizId(null);
    setQuizResult(null);
    setQuizAnswers({});
    setIsRetake(true); 
  };

  const handleNextModule = () => {
    const nextIdx = activeModuleIdx + 1;
    if (nextIdx < (course?.syllabus.length || 0)) {
        setActiveModuleIdx(nextIdx);
        setViewingQuizId(null);
        setQuizResult(null);
        setIsRetake(false);
    } else {
        setShowCompletion(true);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!course || !user) return;
    
    const jsPDF = (await import('jspdf')).default;

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [800, 566]
    });

    // --- Font Loading ---
    // Ensure these fonts are in your 'public/fonts' folder
    doc.addFont('/PinyonScript-Regular.ttf', 'Pinyon Script', 'normal');
    
    // Updated to use Variable Fonts
    doc.addFont('/Raleway-Regular.ttf', 'Raleway', 'normal');
    doc.addFont('/Raleway-Bold.ttf', 'Raleway', 'bold');
    doc.addFont('/Montserrat-Regular.ttf', 'Montserrat', 'normal');

    const img = new Image();
    // Assuming your template has "SERTIFIKAT", "NOMOR:", "Pangkep," pre-printed on it
    img.src = '/certificate_template.png'; 
    
    img.onload = () => {
        doc.addImage(img, 'JPG', 0, 0, 800, 566);
        
        const darkColor = '#1f2937'; 
        
        // 2. Certificate Number
        // Placed next to "NOMOR :"
        doc.setFont('Montserrat', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(darkColor);
        const certNum = `00${Math.floor(Math.random() * 10)}/PASCA/XI/${new Date().getFullYear()}`; 
        doc.text(certNum, 350, 196, { align: 'left' }); 

        // 3. Participant Name
        // Placed on the line using Pinyon Script
        doc.setFont('Pinyon Script', 'normal');
        doc.setFontSize(29);
        doc.setTextColor('#1f2937'); 
        doc.text(user.name, 480, 265, { align: 'center' });

        // 4. Activity/Course Name
        // Placed under "Atas partisipasi..." text
        doc.setFont('Raleway', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(darkColor);
        doc.text(course.title.toUpperCase(), 292, 325, { align: 'left' });

        // 5. Date (Month Year)
        // Placed next to "Pangkep," static text
        doc.setFont('Raleway', 'normal');
        doc.setFontSize(14);
        const date = new Date();
        const monthYear = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
        doc.text(monthYear, 350, 343, { align: 'left' });
        
        doc.save(`Sertifikat-${course.title.replace(/\s+/g, '-')}.pdf`);
    };
    
        img.onerror = () => {
            alert("Template sertifikat tidak ditemukan.");
        };
  };

  const submitReview = async () => {
    if (!reviewComment) return;
    await addReview(courseId, rating, reviewComment);
    setReviewSubmitted(true);
  };

  if (!user || !enrollment || !course) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
            {user ? "Memuat konten kursus..." : "Harap masuk untuk melihat konten ini."}
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20">
            <div className="flex items-center gap-4">
                <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium transition">
                    <ChevronLeft size={16} /> Kembali ke Dasbor
                </button>
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                <h1 className="text-gray-900 font-bold truncate max-w-md">{course.title}</h1>
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-500">
                {sidebarOpen ? <CloseIcon /> : <Menu />}
            </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 flex flex-col">
                <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                    
                    {/* VIEW 0: COMPLETION SCREEN */}
                    {showCompletion ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-xl text-center">
                            <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200 mx-auto mb-6">
                                <Award size={48} className="text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Kursus Selesai!</h2>
                            <p className="text-gray-500 mb-8">Anda telah berhasil menyelesaikan {course.title}.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
                                {/* Certificate Section */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FileText size={20} className="text-emerald-600"/> Sertifikat
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">Unduh sertifikat penyelesaian terverifikasi Anda.</p>
                                    <button 
                                        onClick={handleDownloadCertificate}
                                        className="w-full bg-emerald-600 text-white px-4 py-2 rounded font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                                    >
                                        <Download size={16} /> Unduh PDF
                                    </button>
                                </div>

                                {/* Review Section */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Star size={20} className="text-yellow-500"/> Beri Nilai Kursus
                                    </h3>
                                    {!reviewSubmitted ? (
                                        <div className="space-y-3">
                                            <div className="flex justify-center gap-2 mb-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star 
                                                        key={star} 
                                                        size={24} 
                                                        className={`cursor-pointer ${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                                        onClick={() => setRating(star)}
                                                    />
                                                ))}
                                            </div>
                                            <textarea 
                                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                                placeholder="Tulis ulasan..."
                                                rows={3}
                                                value={reviewComment}
                                                onChange={e => setReviewComment(e.target.value)}
                                            />
                                            <button 
                                                onClick={submitReview}
                                                className="w-full bg-gray-900 text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition"
                                            >
                                                Kirim Ulasan
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center text-green-600 py-8">
                                            <CheckCircle size={48} className="mx-auto mb-2"/>
                                            <p className="font-medium">Terima kasih atas ulasan Anda!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : 

                    /* VIEW 1: QUIZ INTERFACE */
                    viewingQuizId && activeQuiz && currentExam ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-xl">
                            <div className="border-b border-gray-100 pb-6 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-2xl font-bold text-gray-900">{activeQuiz.title}</h2>
                                    {isRetake && <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded border border-orange-200">Percobaan Ulang</span>}
                                </div>
                                <p className="text-gray-500">
                                    {isRetake ? "Anda tidak lulus pada percobaan pertama. Ambil waktu Anda dengan percobaan ulang ini." : "Jawab semua pertanyaan dengan benar untuk melanjutkan."} 
                                    Nilai kelulusan: <span className="text-emerald-600 font-bold">{course.passingGrade || 75}%</span>
                                </p>
                            </div>

                            {!quizResult ? (
                                <div className="space-y-8">
                                    {shuffledQuestions.map((q, qIdx) => (
                                        <div key={q.id} className="space-y-3">
                                            <p className="text-gray-900 font-medium text-lg">{qIdx + 1}. {q.text}</p>
                                            <div className="space-y-2">
                                                {q.scrambledOptions.map((opt, optIdx) => (
                                                    <label key={optIdx} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${quizAnswers[q.id] === optIdx ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                                                        <input type="radio" name={`q-${q.id}`} className="text-emerald-600 focus:ring-emerald-500 bg-white border-gray-300" checked={quizAnswers[q.id] === optIdx} onChange={() => handleAnswerSelect(q.id, optIdx)} />
                                                        <span className="text-gray-700">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                                        <button onClick={submitQuiz} className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20">Kirim Kuis</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    {quizResult.passed ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200 mb-2"><Award size={40} className="text-emerald-600" /></div>
                                            <h3 className="text-3xl font-bold text-gray-900">Selamat!</h3>
                                            <p className="text-gray-500">Anda lulus dengan nilai <span className="text-emerald-600 font-bold">{quizResult.score}%</span>.</p>
                                            <button onClick={handleNextModule} className="mt-6 bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2">Modul Berikutnya <ArrowRight size={18} /></button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center border border-red-200 mb-2"><AlertCircle size={40} className="text-red-500" /></div>
                                            <h3 className="text-3xl font-bold text-gray-900">Tugas Tidak Lulus</h3>
                                            <p className="text-gray-500">Anda mendapat nilai <span className="text-red-500 font-bold">{quizResult.score}%</span>. Anda harus meninjau materi sebelum mengambil ujian ulang.</p>
                                            <button onClick={handleReviewMaterial} className="mt-6 bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition flex items-center gap-2"><RotateCcw size={18} /> Tinjau Materi</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : 
                    
                    /* VIEW 2: MODULE VIDEO INTERFACE */
                    activeModule ? (
                        <>
                            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-gray-200 shadow-xl mb-6 relative group">
                                {activeModule.videoUrl ? (
                                    <iframe 
                                        src={activeModule.videoUrl} 
                                        className="w-full h-full"
                                        allow="autoplay; encrypted-media; fullscreen"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                        <Video size={48} className="mb-4 opacity-50"/>
                                        <p>Tidak ada sumber video yang tersedia untuk modul ini.</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="prose max-w-none">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeModule.title}</h2>
                                    <p className="text-gray-500">Durasi: {activeModule.duration}</p>
                                </div>
                                
                                <button 
                                    onClick={handleMarkAsDone}
                                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition whitespace-nowrap shadow-lg shadow-emerald-600/20"
                                >
                                    <CheckSquare size={18} /> 
                                    {activeModule.linkedTaskId ? 'Tandai Selesai & Ambil Kuis' : 'Tandai Selesai'}
                                    {activeModule.linkedTaskId ? <ArrowRight size={16}/> : null}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500 mt-20">Pilih modul untuk mulai belajar.</div>
                    )}
                </div>
            </main>

            {/* Sidebar Syllabus */}
            <aside className={`fixed md:relative z-10 w-80 bg-white border-l border-gray-200 h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-0 md:border-none'} right-0 shadow-lg md:shadow-none`}>
                <div className="p-4">
                    <h3 className="text-emerald-700 font-bold text-xs uppercase tracking-wider mb-4">Silabus Kursus</h3>
                    <div className="space-y-2">
                        {course.syllabus.map((mod, idx) => {
                            const isActive = idx === activeModuleIdx && !viewingQuizId && !showCompletion;
                            const isCompleted = idx < (enrollment.currentModuleIdx || 0);
                            const isLocked = idx > (enrollment.currentModuleIdx || 0) && enrollment.progress !== 100;

                            return (
                                <button 
                                    key={idx}
                                    onClick={() => !isLocked && handleModuleChange(idx)}
                                    disabled={isLocked}
                                    className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition 
                                        ${isActive ? 'bg-emerald-50 border border-emerald-200' : 'border border-transparent'}
                                        ${isLocked ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-100'}
                                    `}
                                >
                                    <div className={`mt-1 shrink-0`}>
                                        {isActive ? <PlayCircle size={16} className="text-emerald-600"/> : 
                                         isCompleted || enrollment.progress === 100 ? <CheckCircle size={16} className="text-emerald-600"/> : 
                                         isLocked ? <Lock size={16} className="text-gray-400"/> :
                                         <span className="text-gray-500 text-xs font-mono">{idx + 1}</span>}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${isActive ? 'text-emerald-700' : isLocked ? 'text-gray-400' : 'text-gray-700'}`}>
                                            {mod.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{mod.duration}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>
        </div>
    </div>
  );
}