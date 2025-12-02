"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CourseCard from '@/components/CourseCard';
import { useAppContext } from '@/context/AppContext';
import { Filter, X, ArrowDownAZ, ArrowUpAZ, Layers } from 'lucide-react';

function CatalogContent() {
  // [!code highlight] Added searchQuery from context
  const { courses, searchQuery } = useAppContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const categoryParam = searchParams.get('category');
  const [sortOption, setSortOption] = useState('default');

  const processedCourses = useMemo(() => {
    let result = [...courses];

    // 1. Filter by Search Query (Global)
    // [!code highlight:6] Added search filtering logic
    if (searchQuery) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 2. Filter by Category (URL Param)
    if (categoryParam) {
      result = result.filter(c => 
        (c.category && c.category.toLowerCase() === categoryParam.toLowerCase()) || 
        c.title.toLowerCase().includes(categoryParam.toLowerCase()) || 
        c.skills.some(s => s.toLowerCase().includes(categoryParam.toLowerCase()))
      );
    }

    // 3. Sort
    switch (sortOption) {
      case 'alpha-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'alpha-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'type':
        result.sort((a, b) => a.type.localeCompare(b.type));
        break;
      default:
        result.sort((a, b) => a.id - b.id);
        break;
    }

    return result;
  }, [courses, categoryParam, sortOption, searchQuery]); // [!code highlight] Added searchQuery to dependency array

  const clearFilter = () => {
    router.push('/catalog');
  };

  return (
    <div className="page-wrapper section-padding">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-gray-200 pb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
             <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
             {/* [!code highlight:1] Updated title logic to reflect search state */}
             {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : categoryParam ? `Kursus ${categoryParam}` : 'Semua Katalog Kursus'}
          </h1>
          <p className="text-gray-500 max-w-2xl">
            {searchQuery 
              ? `Menemukan ${processedCourses.length} kursus yang cocok dengan pencarian.`
              : categoryParam 
                ? `Menampilkan hasil pencarian untuk "${categoryParam}".`
                : "Jelajahi berbagai topik dan tingkat keahlian untuk menemukan kursus yang sesuai dengan kebutuhan Anda."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {categoryParam && (
             <button 
               onClick={clearFilter}
               className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition px-3 py-2 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100"
             >
               <X size={16} /> Bersihkan Filter
             </button>
          )}
          
          <div className="relative group">
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-gray-700 hover:border-emerald-500/50 transition shadow-sm">
               <Filter size={16} className="text-emerald-600" />
               <select 
                 value={sortOption}
                 onChange={(e) => setSortOption(e.target.value)}
                 className="bg-transparent border-none focus:ring-0 text-sm font-medium outline-none cursor-pointer appearance-none pr-8 text-gray-900"
                 style={{ backgroundImage: 'none' }} 
               >
                 <option value="default">Rekomendasi</option>
                 <option value="alpha-asc">Nama (A-Z)</option>
                 <option value="alpha-desc">Nama (Z-A)</option>
                 <option value="type">Tipe Kursus</option>
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-emerald-600">
                  {sortOption === 'alpha-asc' ? <ArrowDownAZ size={14}/> : 
                   sortOption === 'alpha-desc' ? <ArrowUpAZ size={14}/> : 
                   sortOption === 'type' ? <Layers size={14} /> :
                   <Filter size={0} className="hidden"/>} 
               </div>
            </div>
          </div>
        </div>
      </div>

      {processedCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="card-empty-state">
           <h3 className="text-gray-900 font-bold text-lg mb-2">Tidak ada kursus yang cocok</h3>
           <p className="text-description">Coba bersihkan filter atau menyesuaikan pencarian Anda untuk melihat hasil lebih banyak.</p>
           {(categoryParam || searchQuery) && (
             <button onClick={clearFilter} className="mt-4 text-emerald-600 font-bold hover:underline">Tampilkan Semua Kursus</button>
           )}
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-emerald-600">Loading catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}