'use client';

import { useState } from 'react';
import { setToken, clearToken } from '@/lib/auth/token';
import type { StaffLoginRequest } from '@/types/staff';

export function useStaffAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(credentials: StaffLoginRequest): Promise<boolean> {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/login`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        return false;
      }
      const { access_token } = await res.json();
      setToken(access_token);
      return true;
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    clearToken();
  }

  return { login, logout, isLoading, error };
}
