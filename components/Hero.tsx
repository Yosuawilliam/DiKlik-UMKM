import React from 'react';
import Link from 'next/link';
import { Star, Award, Globe, BookOpen } from 'lucide-react';

export default function Hero() {
  return (
    <div className="bg-white py-12 md:py-24 border-b border-gray-200 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-100/50 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/50 blur-[80px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16 relative z-10">
        <div className="md:w-1/2 space-y-8">
          <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
            <span className="text-emerald-600">DiKlik UMKM</span>
            <br />
            Digital Klinik UMKM.
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-gray-500">
             Pelajari sesuai kecepatanmu, kapan saja dan di mana saja.
          </h2>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/catalog" className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 transform hover:-translate-y-1">
              Jelajahi Kursus
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center h-44 transform translate-y-8 border border-gray-100 hover:border-emerald-200 transition duration-300 group">
                <div className="h-14 w-14 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition text-yellow-500">
                   <Star size={24} fill="currentColor" />
                </div>
                <span className="font-bold text-gray-800 text-lg">Top Rated</span>
                <span className="text-xs text-gray-500 mt-1">5 Star Instructors</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center h-44 border border-gray-100 hover:border-emerald-200 transition duration-300 group">
                <div className="h-14 w-14 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition text-emerald-600">
                   <Award size={24} />
                </div>
                <span className="font-bold text-gray-800 text-lg">Quality</span>
                <span className="text-xs text-gray-500 mt-1">Recognized Certs</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center h-44 transform translate-y-8 border border-gray-100 hover:border-emerald-200 transition duration-300 group">
                 <div className="h-14 w-14 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition text-cyan-600">
                   <Globe size={24} />
                </div>
                <span className="font-bold text-gray-800 text-lg">Global</span>
                <span className="text-xs text-gray-500 mt-1">Belajar Dimana Saja</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center h-44 border border-gray-100 hover:border-emerald-200 transition duration-300 group">
                 <div className="h-14 w-14 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition text-purple-600">
                   <BookOpen size={24} />
                </div>
                <span className="font-bold text-gray-800 text-lg">Fleksibel</span>
                <span className="text-xs text-gray-500 mt-1">Self-Paced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}