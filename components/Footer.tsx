"use client";

import React from 'react';
import Link from 'next/link';
import { Globe, Instagram } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function Footer() {
  const { user } = useAppContext();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-xl font-extrabold text-emerald-600 flex items-center gap-2">
              <Globe size={24} /> DiKlik UMKM
            </div>
            <p className="text-sm text-gray-500 max-w-xs text-center md:text-left">
              Mendukung pembelajar di seluruh dunia dengan pendidikan profesional yang berkualitas dan dapat diakses.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/catalog" className="link-nav">
              Katalog
            </Link>
            <Link 
              href={user && user.role === 'admin' ? '/admin' : '/admin/login'} 
              className="link-nav"
            >
              {user && user.role === 'admin' ? 'Admin Panel' : 'Admin Login'}
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-white transition border border-gray-200 hover:border-emerald-200 hover:shadow-sm">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {currentYear} DiKlik UMKM Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Sistem Operasional
          </div>
        </div>
      </div>
    </footer>
  );
}