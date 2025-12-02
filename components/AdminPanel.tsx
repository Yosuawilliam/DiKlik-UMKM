"use client";

import React, { useState } from 'react';
import { ChevronRight, Trash2, Edit, Plus, ChevronDown, ChevronUp, Save, X, Link as LinkIcon, BookOpen, Users, Layers } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Course, Module, Task, Exam, Question, CATEGORIES } from '@/lib/data';

export default function AdminPanel() {
  const { courses, addCourse, updateCourse, deleteCourse } = useAppContext();
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({});

  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  // --- Perhitungan Statistik Dasbor ---
  const totalCourses = courses.length;
  const totalStudents = courses.reduce((acc, curr) => acc + (Number(curr.enrollmentCount) || 0), 0);
  const totalModules = courses.reduce((acc, curr) => acc + (curr.syllabus?.length || 0), 0);

  const startEdit = (course: Course) => {
    setEditingId(course.id);
    setFormData(JSON.parse(JSON.stringify(course))); 
  };

  const startNew = () => {
    setEditingId('new');
    setFormData({
      id: Date.now(),
      title: '', partner: 'Coursetify Internal', type: 'Course', level: 'Beginner', 
      duration: '4 Minggu', students: '0', rating: 0, reviews: '0',
      description: '', category: 'Bisnis',
      skills: [],
      syllabus: [], 
      tasks: [], 
      imageColor: 'bg-emerald-600',
      isOffline: false,
      passingGrade: 75,
      thumbnail: ''
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.partner) {
      alert("Harap isi kolom yang wajib diisi (Judul, Mitra).");
      return;
    }

    if (!window.confirm("Apakah Anda yakin ingin menyimpan perubahan ini pada kursus?")) {
      return;
    }

    if (editingId === 'new') {
        addCourse(formData as Course);
    } else {
        updateCourse(formData as Course);
    }
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("PERINGATAN: Apakah Anda yakin ingin menghapus kursus ini? Tindakan ini tidak dapat dibatalkan.")) {
      deleteCourse(id);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Buang perubahan yang belum disimpan?")) {
      setEditingId(null);
    }
  };

  const handleArrayChange = (field: 'skills', idx: number, val: string) => {
    const arr = [...(formData[field] || [])];
    arr[idx] = val;
    setFormData({ ...formData, [field]: arr });
  };
  
  const addArrayItem = (field: 'skills') => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ""] });
  };

  const removeArrayItem = (field: 'skills', idx: number) => {
    const arr = (formData[field] || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, [field]: arr });
  };

  const addModule = () => {
    const newModule: Module = { title: "Modul Baru", videoUrl: "", duration: "1j" };
    setFormData({ ...formData, syllabus: [...(formData.syllabus || []), newModule] });
  };

  const updateModule = (idx: number, field: keyof Module, val: any) => {
    const syllabus = [...(formData.syllabus || [])];
    // @ts-ignore
    syllabus[idx] = { ...syllabus[idx], [field]: val };
    setFormData({ ...formData, syllabus });
  };

  const removeModule = (idx: number) => {
    if(!window.confirm("Hapus modul ini?")) return;
    setFormData({ ...formData, syllabus: (formData.syllabus || []).filter((_, i) => i !== idx) });
  };

  const generateEmptyExam = (type: 'First Attempt' | 'Retake'): Exam => ({
    id: Date.now() + Math.random(),
    type,
    questions: []
  });

  const addTask = () => {
    const newTask: Task = {
      id: Date.now(),
      title: "Kuis Baru",
      exams: [
        generateEmptyExam('First Attempt'),
        generateEmptyExam('Retake')
      ]
    };
    setFormData({ ...formData, tasks: [...(formData.tasks || []), newTask] });
  };

  const removeTask = (idx: number) => {
    if(!window.confirm("Hapus kuis ini beserta semua pertanyaannya?")) return;
    setFormData({ ...formData, tasks: (formData.tasks || []).filter((_, i) => i !== idx) });
  };

  const updateTaskTitle = (idx: number, val: string) => {
    const tasks = [...(formData.tasks || [])];
    tasks[idx].title = val;
    setFormData({ ...formData, tasks });
  };

  const addQuestion = (taskIdx: number, examIdx: number) => {
    const tasks = [...(formData.tasks || [])];
    const exam = tasks[taskIdx].exams[examIdx];
    const newQ: Question = {
        id: Date.now(),
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0
    };
    exam.questions.push(newQ);
    setFormData({ ...formData, tasks });
  };

  const removeQuestion = (taskIdx: number, examIdx: number, qIdx: number) => {
    const tasks = [...(formData.tasks || [])];
    const exam = tasks[taskIdx].exams[examIdx];
    exam.questions = exam.questions.filter((_, i) => i !== qIdx);
    setFormData({ ...formData, tasks });
  };

  const updateQuestion = (taskIdx: number, examIdx: number, qIdx: number, field: keyof Question, val: any) => {
    const tasks = [...(formData.tasks || [])];
    const exam = tasks[taskIdx].exams[examIdx];
    // @ts-ignore
    exam.questions[qIdx][field] = val;
    setFormData({ ...formData, tasks });
  };
  
  const updateOption = (taskIdx: number, examIdx: number, qIdx: number, optIdx: number, val: string) => {
    const tasks = [...(formData.tasks || [])];
    tasks[taskIdx].exams[examIdx].questions[qIdx].options[optIdx] = val;
    setFormData({ ...formData, tasks });
  };


  if (editingId) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 text-gray-900">
        <button onClick={handleCancel} className="text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-2 transition">
           <ChevronRight className="rotate-180" size={16}/> Kembali ke Daftar Kursus
        </button>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">{editingId === 'new' ? 'Tambah Kursus Baru' : 'Edit Kursus'}</h2>
          <div className="flex gap-4">
             <button type="button" onClick={handleCancel} className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition">Batal</button>
             <button onClick={handleSave} className="bg-emerald-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 flex items-center gap-2">
               <Save size={18} /> Simpan Kursus
             </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6 shadow-sm">
            <h3 className="text-xl font-bold text-emerald-600 border-b border-gray-100 pb-2">Informasi Dasar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Judul Kursus</label>
                <input type="text" className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                  value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Mitra/Institusi</label>
                <input type="text" className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                  value={formData.partner || ''} onChange={e => setFormData({...formData, partner: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Kategori</label>
                <select className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nilai Kelulusan (%)</label>
                <input type="number" min="0" max="100" className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                  value={formData.passingGrade || 75} onChange={e => setFormData({...formData, passingGrade: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tipe Kursus</label>
                 <select className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="Course">Kursus</option>
                  <option value="Specialization">Spesialisasi</option>
                  <option value="Professional Certificate">Sertifikat Profesional</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Mode Kursus</label>
                <select 
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  value={formData.isOffline ? 'offline' : 'online'} 
                  onChange={e => setFormData({...formData, isOffline: e.target.value === 'offline'})}
                >
                  <option value="online">Kursus Online</option>
                  <option value="offline">Offline / Tatap Muka</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Durasi</label>
                <input type="text" className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                  value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="cth. 4 Minggu" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">URL Gambar Thumbnail</label>
                <input type="text" className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                  value={formData.thumbnail || ''} onChange={e => setFormData({...formData, thumbnail: e.target.value})} placeholder="https://..." />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Deskripsi</label>
              <textarea className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none" rows={4}
                value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            {/* Skills */}
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Keahlian yang Diperoleh</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills?.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                            <input 
                                value={skill} 
                                onChange={(e) => handleArrayChange('skills', idx, e.target.value)}
                                className="bg-transparent border-none focus:outline-none text-sm text-gray-800 w-32"
                            />
                            <button type="button" onClick={() => removeArrayItem('skills', idx)} className="text-red-500 hover:text-red-700"><X size={14}/></button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('skills')} className="text-sm text-emerald-600 hover:underline px-2">+ Tambah Keahlian</button>
                </div>
            </div>
          </div>

          {/* 2. Syllabus / Modules */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
               <h3 className="text-xl font-bold text-emerald-600">Silabus & Modul</h3>
               <button type="button" onClick={addModule} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded border border-gray-300 transition">+ Tambah Modul</button>
            </div>
            
            <div className="space-y-4">
              {formData.syllabus?.map((mod, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col gap-4">
                   <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                       <div className="md:col-span-5">
                          <label className="text-xs text-gray-500 block mb-1">Judul Modul</label>
                          <input type="text" className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-gray-900" 
                            value={mod.title} onChange={e => updateModule(idx, 'title', e.target.value)} />
                       </div>
                       <div className="md:col-span-5">
                          <label className="text-xs text-gray-500 block mb-1">URL Video (Embed YouTube)</label>
                          <input type="text" className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-gray-900 placeholder-gray-400" 
                            value={mod.videoUrl} onChange={e => updateModule(idx, 'videoUrl', e.target.value)} placeholder="https://www.youtube.com/embed/..." />
                       </div>
                       <div className="md:col-span-1">
                           <label className="text-xs text-gray-500 block mb-1">Durasi</label>
                           <input type="text" className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-gray-900" 
                            value={mod.duration} onChange={e => updateModule(idx, 'duration', e.target.value)} />
                       </div>
                       <div className="md:col-span-1 flex justify-end">
                          <button type="button" onClick={() => removeModule(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                       </div>
                   </div>
                   
                   <div className="flex items-center gap-2 border-t border-gray-200 pt-3">
                      <LinkIcon size={14} className="text-emerald-600" />
                      <label className="text-xs text-gray-500">Aksi Berikutnya (Kuis):</label>
                      <select 
                        className="bg-white border border-gray-300 rounded p-1 text-xs text-gray-900 outline-none"
                        value={mod.linkedTaskId || ''}
                        onChange={e => updateModule(idx, 'linkedTaskId', e.target.value ? Number(e.target.value) : undefined)}
                      >
                        <option value="">-- Tidak Ada Kuis --</option>
                        {formData.tasks?.map(task => (
                            <option key={task.id} value={task.id}>{task.title}</option>
                        ))}
                      </select>
                   </div>
                </div>
              ))}
              {(!formData.syllabus || formData.syllabus.length === 0) && <p className="text-gray-400 italic text-sm">Belum ada modul yang ditambahkan.</p>}
            </div>
          </div>

          {/* 3. Tasks & Quizzes */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
               <h3 className="text-xl font-bold text-emerald-600">Tugas & Kuis</h3>
               <button type="button" onClick={addTask} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded border border-gray-300 transition">+ Tambah Kuis</button>
            </div>

            <div className="space-y-6">
               {formData.tasks?.map((task, tIdx) => (
                 <div key={task.id} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    {/* Task Header */}
                    <div className="p-4 bg-gray-100 flex justify-between items-center cursor-pointer" onClick={() => setExpandedTask(expandedTask === tIdx ? null : tIdx)}>
                        <div className="flex items-center gap-4 flex-1">
                            <span className="font-mono text-gray-500">#{tIdx + 1}</span>
                            <input 
                                type="text" 
                                className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 font-bold w-1/2"
                                value={task.title}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => updateTaskTitle(tIdx, e.target.value)}
                            />
                            <span className="text-xs text-gray-500">({task.exams.length} Ujian Dikonfigurasi)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={(e) => { e.stopPropagation(); removeTask(tIdx); }} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18}/></button>
                            {expandedTask === tIdx ? <ChevronUp size={20} className="text-gray-500"/> : <ChevronDown size={20} className="text-gray-500"/>}
                        </div>
                    </div>

                    {/* Task Content (Exams) */}
                    {expandedTask === tIdx && (
                        <div className="p-4 space-y-4">
                            {task.exams.map((exam, eIdx) => (
                                <div key={exam.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-emerald-600">{exam.type === 'First Attempt' ? 'Percobaan Pertama' : 'Percobaan Ulang'} <span className="text-gray-500 text-sm font-normal">({exam.questions.length} Pertanyaan)</span></h4>
                                        <button 
                                            type="button" 
                                            onClick={() => setExpandedExam(expandedExam === `${tIdx}-${eIdx}` ? null : `${tIdx}-${eIdx}`)}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            {expandedExam === `${tIdx}-${eIdx}` ? 'Tutup Pertanyaan' : 'Edit Pertanyaan'}
                                        </button>
                                    </div>

                                    {/* Questions Editor */}
                                    {expandedExam === `${tIdx}-${eIdx}` && (
                                        <div className="space-y-6 pl-4 border-l-2 border-gray-100">
                                            {exam.questions.map((q, qIdx) => (
                                                <div key={q.id} className="bg-gray-50 p-4 rounded border border-gray-200 relative group">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-xs text-gray-500 uppercase font-bold">Pertanyaan {qIdx + 1}</span>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeQuestion(tIdx, eIdx, qIdx)}
                                                            className="text-red-500 hover:text-red-700 opacity-50 group-hover:opacity-100 transition"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-white border border-gray-300 rounded p-2 text-sm text-gray-900 mb-3"
                                                        value={q.text}
                                                        onChange={(e) => updateQuestion(tIdx, eIdx, qIdx, 'text', e.target.value)}
                                                        placeholder="Masukkan teks pertanyaan..."
                                                    />
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {q.options.map((opt, optIdx) => (
                                                            <div key={optIdx} className="flex items-center gap-2">
                                                                <input 
                                                                    type="radio" 
                                                                    name={`correct-${tIdx}-${eIdx}-${qIdx}`}
                                                                    checked={q.correctAnswer === optIdx}
                                                                    onChange={() => updateQuestion(tIdx, eIdx, qIdx, 'correctAnswer', optIdx)}
                                                                />
                                                                <input 
                                                                    type="text" 
                                                                    className="w-full bg-white border border-gray-300 rounded p-1 text-xs text-gray-700"
                                                                    value={opt}
                                                                    onChange={(e) => updateOption(tIdx, eIdx, qIdx, optIdx, e.target.value)}
                                                                    placeholder={`Opsi ${optIdx + 1}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            <button 
                                                type="button" 
                                                onClick={() => addQuestion(tIdx, eIdx)}
                                                className="w-full py-2 bg-white text-gray-500 text-sm rounded border border-dashed border-gray-300 hover:border-emerald-500 hover:text-emerald-600 transition"
                                            >
                                                + Tambah Pertanyaan
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                 </div>
               ))}
               {(!formData.tasks || formData.tasks.length === 0) && <p className="text-gray-400 italic text-sm">Belum ada kuis. Klik "Tambah Kuis" untuk memulai.</p>}
            </div>
          </div>

        </form>
      </div>
    );
  }

  // --- Main List View ---
  return (
    <div className="page-wrapper section-padding">
       <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold text-gray-900">Panel Admin</h1>
         <button onClick={startNew} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20">
           <Plus size={20}/> Tambah Kursus Baru
         </button>
       </div>

       {/* Dashboard Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
             <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <BookOpen size={24} />
             </div>
             <div>
                <p className="text-sm text-gray-500">Total Kursus</p>
                <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
             <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <Users size={24} />
             </div>
             <div>
                <p className="text-sm text-gray-500">Total Siswa</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
             <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <Layers size={24} />
             </div>
             <div>
                <p className="text-sm text-gray-500">Total Modul</p>
                <p className="text-2xl font-bold text-gray-900">{totalModules}</p>
             </div>
          </div>
       </div>

       <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
         <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kursus</th>
               <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mitra</th>
               <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Syarat Nilai</th>
               <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
             </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             {courses.map(course => (
               <tr key={course.id} className="hover:bg-gray-50 transition">
                 <td className="px-6 py-4">
                   <div className="text-sm font-bold text-gray-900">{course.title}</div>
                   <div className="text-xs text-emerald-600">{course.type} · {course.level === 'Beginner' ? 'Pemula' : course.level === 'Intermediate' ? 'Menengah' : 'Lanjutan'}</div>
                 </td>
                 <td className="px-6 py-4 text-sm text-gray-600">{course.partner}</td>
                 <td className="px-6 py-4 text-sm text-gray-600">{course.passingGrade || 75}%</td>
                 <td className="px-6 py-4 text-right text-sm font-medium">
                   <div className="flex justify-end gap-3">
                     <button onClick={() => startEdit(course)} className="text-blue-600 hover:text-blue-800 transition p-1 bg-blue-50 rounded"><Edit size={16}/></button>
                     <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-800 transition p-1 bg-red-50 rounded"><Trash2 size={16}/></button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
}