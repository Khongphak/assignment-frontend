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
      // FE-3: replace this block with a server action or fetch to POST /staff/login.
      // The server action should set an httpOnly cookie instead of calling setToken().
      //
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/login`,
      //   { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) }
      // );
      // if (!res.ok) {
      //   const { error } = await res.json();
      //   setError(error.message);
      //   return false;
      // }
      // const { access_token } = await res.json();
      // setToken(access_token);
      // return true;

      await new Promise((r) => setTimeout(r, 600)); // simulate network latency

      if (!credentials.username || !credentials.password || !credentials.hospital_code) {
        setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
        return false;
      }

      setToken(`mock_jwt_${Date.now()}`);
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
