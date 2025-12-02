"use client";

import React, { useEffect } from 'react';
import AdminPanel from '@/components/AdminPanel';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user } = useAppContext();
  const router = useRouter();

  // Route protection
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50">
        <AdminPanel />
    </div>
  );
}