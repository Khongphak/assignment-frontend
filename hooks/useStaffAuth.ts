'use client';

import { useState } from 'react';
import { setToken } from '@/lib/auth/token';
import { loginAction } from '@/app/actions/auth';
import type { StaffLoginRequest } from '@/types/staff';

export function useStaffAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(credentials: StaffLoginRequest): Promise<boolean> {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAction(credentials);
      if ('error' in result) {
        setError(result.error);
        return false;
      }
      setToken(result.access_token);
      return true;
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading, error };
}
