"use client";

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { 
  Star, User, CheckCircle, PlayCircle, Clock, BarChart, 
  Globe, ChevronRight, ShieldCheck, MapPin, Calendar, 
  Ticket, FileText, Video
} from 'lucide-react';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { courses, user, enroll, isEnrolled } = useAppContext();
  
  const courseId = Number(id);
  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-500 font-mono">
        <h2 className="text-2xl font-bold mb-4 text-emerald-600">SISTEM ERROR: Kursus tidak ditemukan</h2>
        <button onClick={() => router.push('/')} className="text-emerald-600 hover:text-emerald-700 hover:underline">
          &lt; Kembali ke Katalog
        </button>
      </div>
    );
  }

  const enrolled = isEnrolled(course.id);

  const handleEnroll = () => {
    if (!user) {
        router.push('/login');
        return;
    }
    enroll(course);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-500 flex items-center gap-2 border-b border-gray-200">
        <span onClick={() => router.push('/')} className="cursor-pointer hover:text-emerald-600 transition hover:underline">DiKlik UMKM</span>
        <ChevronRight size={14} className="text-gray-400" />
        <span onClick={() => router.push('/catalog')} className="cursor-pointer hover:text-emerald-600 transition hover:underline">Katalog</span>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="text-emerald-600 font-medium truncate">{course.title}</span>
      </div>

      {/* Hero Banner Area */}
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-12">
           
           {/* Left Content */}
           <div className="md:w-2/3 space-y-8">
              <div className="flex items-center gap-2">
                 <div className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider rounded">
                   {course.type}
                 </div>
                 {course.isOffline && (
                    <div className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1">
                      <MapPin size={10} /> Offline
                    </div>
                 )}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {course.title}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed border-l-4 border-emerald-500 pl-4">
                {course.description}
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span className="text-gray-900">{course.rating}</span>
                  <span className="text-gray-500">({course.reviews} review)</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  <User size={16} className="text-gray-500" />
                  <span className="text-gray-600">{course.students} murid.</span>
                </div>
              </div>

              {/* Partner Info */}
              <div className="flex items-center gap-4 pt-2">
                 <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-xl text-emerald-600 border border-gray-200 shadow-sm">
                   {course.partner[0]}
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase tracking-widest">Dibawakan oleh</p>
                   <p className="font-bold text-gray-900 text-lg">{course.partner}</p>
                 </div>
              </div>
              
              {/* Action Buttons */}
              <div className="pt-4 hidden md:block">
                {enrolled ? (
                    <button className="bg-gray-100 text-emerald-600 border border-emerald-200 px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-3 cursor-default hover:bg-gray-200 transition">
                        <ShieldCheck size={22} /> {course.isOffline ? 'Terdaftar' : 'Akses Diberikan'}
                    </button>
                ) : (
                    <button onClick={handleEnroll} className="bg-emerald-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 transform hover:-translate-y-1 flex items-center gap-2">
                        {course.isOffline ? <Ticket size={20} /> : null}
                        {course.isOffline ? 'Booking Sekarang' : 'Mulai Belajar Sekarang'}
                    </button>
                )}
                <p className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                  <CheckCircle size={12} className="text-emerald-600"/> 
                  {course.isOffline ? 'Kursi terbatas · Sertifikat kehadiran' : 'Akses penuh seumur hidup · Sertifikat penyelesaian'}
                </p>
              </div>
           </div>
           
           {/* Sidebar Card (Floating) */}
           <div className="hidden md:block md:w-1/3 relative">
             <div className="sticky top-24 bg-white p-2 rounded-xl shadow-xl border border-gray-200">
                <div className={`h-52 rounded-lg ${course.imageColor} mb-2 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-60"></div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group cursor-pointer hover:bg-black/20 transition backdrop-blur-[1px] hover:backdrop-blur-none">
                      <div className="bg-white/20 p-4 rounded-full border border-white/30 backdrop-blur-md transition-transform transform group-hover:scale-110">
                        {course.isOffline ? <Ticket size={48} className="text-white" /> : <PlayCircle size={48} className="text-white fill-white/20" />}
                      </div>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4 text-gray-600 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-gray-100 rounded text-emerald-600">
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Durasi</p>
                          <p className="text-xs text-gray-500">{course.duration}</p>
                        </div>
                    </div>
                    
                    {/* Offline Specific Fields */}
                    {course.isOffline ? (
                      <>
                        <div className="flex items-center gap-4 text-gray-600 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-gray-100 rounded text-purple-600">
                              <MapPin size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">Lokasi</p>
                              <p className="text-xs text-gray-500">{course.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-gray-100 rounded text-purple-600">
                              <Calendar size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">Jadwal</p>
                              <p className="text-xs text-gray-500">{course.schedule}</p>
                            </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-4 text-gray-600 pb-4 border-b border-gray-100">
                          <div className="p-2 bg-gray-100 rounded text-emerald-600">
                            <Globe size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Format</p>
                            <p className="text-xs text-gray-500">100% Online</p>
                          </div>
                       </div>
                    )}

                    <div className="flex items-center gap-4 text-gray-600">
                        <div className="p-2 bg-gray-100 rounded text-emerald-600">
                          <BarChart size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Tingkat Kesulitan</p>
                          <p className="text-xs text-gray-500">{course.level}</p>
                        </div>
                    </div>
                </div>
             </div>
           </div>

           {/* Mobile Enroll Action */}
           <div className="md:hidden mt-6">
             {enrolled ? (
                <button className="w-full bg-gray-100 border border-emerald-200 text-emerald-600 px-6 py-4 rounded-lg font-bold flex justify-center items-center gap-2">
                  <ShieldCheck size={20} /> {course.isOffline ? 'Terdaftar' : 'Akses Diberikan'}
                </button>
             ) : (
                <button onClick={handleEnroll} className="w-full bg-emerald-600 text-white px-6 py-4 rounded-lg font-bold shadow-lg">
                   {course.isOffline ? 'Booking Sekarang' : 'Mulai Belajar Sekarang'}
                </button>
             )}
          </div>
        </div>
      </div>

      {/* Main Content: Skills, Syllabus, Tasks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row gap-16">
        <div className="md:w-2/3 space-y-16">
          
          {/* Skills Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="h-8 w-1 bg-emerald-600 rounded-full"></span>
              Keahlian yang Akan Anda Dapatkan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white border border-gray-200 p-4 rounded-lg hover:border-emerald-200 transition duration-300 shadow-sm">
                  <CheckCircle size={20} className="text-emerald-600 shrink-0" />
                  <span className="text-gray-700 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Syllabus Section - Renders Video if Enrolled */}
          <section>
             <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="h-8 w-1 bg-emerald-600 rounded-full"></span>
              {course.isOffline ? 'Agenda Workshop' : 'Silabus Kursus'}
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {course.syllabus && course.syllabus.map((module, idx) => (
                <div key={idx} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition group">
                  <div className="flex items-start gap-6">
                    <div className="shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold font-mono group-hover:bg-emerald-600 group-hover:text-white transition">
                        {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{module.title}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                           <Clock size={14}/> {module.duration}
                        </p>
                        
                        {/* Video Embed (Only if enrolled and link exists) */}
                        {enrolled && module.videoUrl && (
                            <div className="mt-6">
                                <iframe 
                                    src={module.videoUrl} 
                                    className="w-full h-64 md:h-80 rounded-lg border border-gray-200 bg-black" 
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tasks Section - Renders Quizzes */}
          {course.tasks && course.tasks.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="h-8 w-1 bg-emerald-600 rounded-full"></span>
                {course.isOffline ? 'Ujian Praktek' : 'Quiz & Tugas'}
              </h2>
              <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-8 relative overflow-hidden shadow-sm">
                 <ul className="space-y-4 relative z-10">
                   {course.tasks.map((task, idx) => (
                     <li key={idx} className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-200 transition shadow-sm">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-emerald-100 rounded flex items-center justify-center text-emerald-600">
                             <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-gray-800 font-medium">{task.title}</p>
                            <p className="text-xs text-gray-500">{task.exams.length} jumlah tipe quiz</p>
                          </div>
                       </div>
                       {enrolled && (
                           <button className="text-xs font-bold bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20">
                             Mulai Quiz
                           </button>
                       )}
                     </li>
                   ))}
                 </ul>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}