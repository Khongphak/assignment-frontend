'use server';

import { cookies } from 'next/headers';
import type { StaffLoginRequest, StaffLoginResponse } from '@/types/staff';

const COOKIE_NAME = 'staff_refresh_token';
const THIRTY_DAYS = 30 * 24 * 60 * 60;

const cookieOptions = {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  maxAge: THIRTY_DAYS,
};

export async function loginAction(
  credentials: StaffLoginRequest
): Promise<{ access_token: string } | { error: string }> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { error: body?.error?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' };
    }
    const { access_token, refresh_token } = (await res.json()) as StaffLoginResponse;
    const jar = await cookies();
    jar.set(COOKIE_NAME, refresh_token, cookieOptions);
    return { access_token };
  } catch {
    return { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' };
  }
}

export async function refreshAction(): Promise<{ access_token: string } | null> {
  const jar = await cookies();
  const refreshToken = jar.get(COOKIE_NAME)?.value;
  if (!refreshToken) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );
    if (!res.ok) {
      jar.delete(COOKIE_NAME);
      return null;
    }
    const { access_token, refresh_token } = (await res.json()) as StaffLoginResponse;
    jar.set(COOKIE_NAME, refresh_token, cookieOptions);
    return { access_token };
  } catch {
    return null;
  }
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  const refreshToken = jar.get(COOKIE_NAME)?.value;

  if (refreshToken) {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/logout`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }
      );
    } catch {
      // best-effort: delete cookie regardless
    }
  }

  jar.delete(COOKIE_NAME);
}
