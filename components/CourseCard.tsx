import React from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { Course } from '@/lib/data';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`} className="group block h-full">
      <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-emerald-600/10 hover:border-emerald-500/50 transition duration-300 h-full relative">
        
        <div className={`h-44 w-full ${course.imageColor} relative p-4 flex items-start justify-end`}>
          <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-sm border border-emerald-100">
            {course.type}
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-emerald-600 border border-gray-200">
              {course.partner[0]}
            </div>
            <span className="text-xs text-gray-500 font-medium truncate uppercase tracking-wide">{course.partner}</span>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-600 transition line-clamp-2 leading-tight">
            {course.title}
          </h3>
          
          <div className="mt-auto pt-6 space-y-3">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500 fill-current" />
              <span className="font-bold text-gray-900 text-sm">{course.rating}</span>
              <span className="text-gray-500 text-xs border-l border-gray-300 pl-2 ml-1">({course.reviews} review)</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500 font-medium">
                {course.level}
              </div>
              <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2.5 group-hover:translate-x-0">
                Lihat Detail <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}