"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Menu, Globe, ChevronDown, Settings, LogOut } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, searchQuery, setSearchQuery } = useAppContext();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-gray-500 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="text-2xl font-extrabold text-emerald-600 tracking-tighter flex items-center gap-2 hover:text-emerald-700 transition">
              <Globe className="text-emerald-600" size={24} />
              DiKlik UMKM
            </Link>
            <Link 
              href="/catalog"
              className="hidden md:flex items-center gap-1 text-gray-600 hover:text-emerald-600 px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Jelajahi Semua Kursus
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <input
              type="text"
              placeholder="Apa yang anda cari?"
              className="w-full pl-4 pr-10 py-2 rounded-full bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-2.5 bg-emerald-600 p-1 rounded-full text-white cursor-pointer hover:bg-emerald-700 transition">
              <Search size={14} />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link 
                    href="/admin"
                    className="text-sm font-medium hidden md:flex items-center gap-1 text-gray-500 hover:text-emerald-600 transition"
                  >
                    <Settings size={16} /> Admin Panel
                  </Link>
                )}
                <Link 
                  href="/dashboard"
                  className="text-sm font-medium hidden md:block hover:text-emerald-600 text-gray-600 transition"
                >
                  Kursus Saya
                </Link>
                <Bell size={20} className="text-gray-500 cursor-pointer hover:text-emerald-600 transition" />
                
                {/* User Dropdown */}
                <div className="relative group h-full flex items-center">
                  <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200 cursor-pointer hover:border-emerald-500 transition">
                    {user.name[0]}
                  </div>
                  
                  <div className="absolute right-0 top-full pt-2 w-56 hidden group-hover:block z-50">
                    <div className="bg-white rounded-lg shadow-xl py-1 border border-gray-100">
                      <div className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Masuk sebagai</p>
                        <p className="font-bold text-gray-900 truncate">{user.name}</p>
                      </div>
                      <button 
                        onClick={() => { logout(); router.push('/'); }} 
                        className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600 flex items-center gap-2 transition"
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 font-medium text-sm hover:text-emerald-600 transition">
                  Log In
                </Link>
                <Link 
                  href="/register"
                  className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
                >
                  Bergabung Sekarang
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
       {/* Mobile Menu */}
       {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4 absolute w-full shadow-xl z-50">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg mb-4 text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <nav className="flex flex-col gap-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-gray-600 font-medium hover:text-emerald-600">Home</Link>
            {user ? (
              <>
                 <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-gray-600 font-medium hover:text-emerald-600">Kursus Saya</Link>
                 {user.role === 'admin' &&  <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-gray-600 font-medium hover:text-emerald-600">Admin Panel</Link>}
                 <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-gray-600 font-medium hover:text-red-600 flex items-center gap-2">
                   <LogOut size={16} /> Log Out
                 </button>
              </>
            ) : (
               <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-600 font-medium hover:text-emerald-600">Log In</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}