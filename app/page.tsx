"use client";

import React from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import CategoryRail from '@/components/CategoryRail';
import CourseCard from '@/components/CourseCard';
import { useAppContext } from '@/context/AppContext';
import { ArrowRight, MapPin } from 'lucide-react';

export default function Home() {
  const { courses, searchQuery } = useAppContext();

  // Filter courses based on search from Context
  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Separate Offline vs Online for the view (only when not searching)
  const onlineCourses = filteredCourses.filter(c => !c.isOffline);
  const offlineCourses = filteredCourses.filter(c => c.isOffline);

  return (
    <div>
      {/* Only show Hero & Categories if NOT searching */}
      {!searchQuery && <Hero />}
      {!searchQuery && <CategoryRail />}
      
      <div className="page-wrapper section-padding">
        
        {/* Section 1: Featured Online Courses */}
        <div className="flex justify-between items-end mb-8">
          <h2 className="heading-section">
            {searchQuery ? (
              `Hasil untuk "${searchQuery}"`
            ) : (
              <>
                <span className="pill-accent"></span>
                Katalog Kursus Online
              </>
            )}
          </h2>
          {!searchQuery && (
            <Link href="/catalog" className="link-accent text-sm flex items-center gap-1 group">
              Lihat Semua Katalog <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          )}
        </div>
        
        {onlineCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {onlineCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          !offlineCourses.length && (
            <div className="card-empty-state">
              <h3 className="text-gray-800 font-bold text-lg mb-2">Tidak ada kursus yang cocok</h3>
              <p className="text-description">Sesuaikan kata kunci dan coba lagi.</p>
            </div>
          )
        )}

        {/* Section 2: Offline Courses (Only show if not searching or if search matches them) */}
        {offlineCourses.length > 0 && (
          <div className="mt-20">
             <div className="flex justify-between items-end mb-8">
              <h2 className="heading-section">
                <span className="w-1.5 h-8 bg-purple-500 rounded-full"></span>
                Offline Workshop
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offlineCourses.map(course => (
                <div key={course.id} className="relative">
                   {/* [!code highlight:1] Changed top-4 to top-12 to move badge lower */}
                   <div className="absolute top-12 right-4 z-20 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                      <MapPin size={10} /> Offline
                   </div>
                   <CourseCard course={course} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}