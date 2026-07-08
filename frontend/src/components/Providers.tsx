'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const { token, fetchMe } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token, fetchMe]);

  return <>{children}</>;
}
