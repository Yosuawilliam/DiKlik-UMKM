"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, PlayCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, enrolledCourses, enrollments } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-12 border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
             <span className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <BookOpen className="text-emerald-600" size={28}/>
             </span>
             Kursus Saya
           </h1>
           <p className="text-gray-500 mt-2 ml-14">Selamat datang, {user.name}. Lanjutkan belajarmu di DiKlik UMKM.</p>
         </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200 dashed-border">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada kursus aktif</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Anda belum mendaftar dalam kursus apapun. Mulai perjalanan Anda sekarang.</p>
            <Link 
              href="/catalog"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
            >
              Cari Kursus
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map(course => {
              const enrollment = enrollments.find(e => e.courseId === course.id);
              const progress = enrollment ? enrollment.progress : 0;
              
              return (
                <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition group">
                  <div className={`h-40 ${course.imageColor} relative p-4 overflow-hidden`}>
                     <div className="absolute inset-0 bg-black/10"></div>
                     <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold rounded text-emerald-700 border border-emerald-100 shadow-sm">Dalam Kursus</span>
                     <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">
                       <PlayCircle className="text-white" size={24} />
                     </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition">{course.title}</h3>
                    <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider font-medium">{course.partner}</p>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>Progress</span>
                          <span className="text-emerald-600 font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                        <div className="bg-emerald-600 h-2 rounded-full shadow-sm" style={{ width: `${progress}%` }}></div>
                      </div>
                      <Link href={`/learning/${course.id}`} className="block w-full bg-gray-50 text-gray-700 py-3 rounded-lg font-bold text-sm hover:bg-emerald-600 hover:text-white transition text-center border border-gray-200 hover:border-emerald-600">
                        Lanjutkan Belajar
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}