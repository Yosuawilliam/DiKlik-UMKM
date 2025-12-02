import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/data';

export default function CategoryRail() {
  return (
    <div className="py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-600 rounded-full"></span> 
            Jelajahi Kategori
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map((cat, idx) => (
            <Link 
              key={idx}
              href={`/catalog?category=${encodeURIComponent(cat)}`}
              className="whitespace-nowrap px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-white hover:text-emerald-600 hover:border-emerald-200 hover:shadow-sm transition duration-200 text-sm"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}