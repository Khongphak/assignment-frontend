'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStaffAuth } from '@/hooks/useStaffAuth';
import { setToken } from '@/lib/auth/token';
import { refreshAction } from '@/app/actions/auth';

export default function StaffLoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useStaffAuth();
  const [form, setForm] = useState({ username: '', password: '', hospital_code: '' });

  useEffect(() => {
    refreshAction().then((result) => {
      if (result) {
        setToken(result.access_token);
        router.replace('/staff/view');
      }
    });
  }, [router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(form);
    if (ok) router.push('/staff/view');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg mb-4">
            <svg
              className="size-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Portal</h1>
          <p className="mt-1 text-sm text-slate-500">เข้าสู่ระบบเพื่อดูข้อมูลผู้ป่วย</p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-900/5">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="hospital_code" className="mb-1 block text-sm font-medium text-slate-700">
                รหัสโรงพยาบาล
                <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="hospital_code"
                name="hospital_code"
                type="text"
                value={form.hospital_code}
                onChange={handleChange}
                autoComplete="organization"
                placeholder="เช่น HOSP01"
                required
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
                ชื่อผู้ใช้
                <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="username"
                required
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                รหัสผ่าน
                <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Mock mode — กรอกข้อมูลใดก็ได้เพื่อทดสอบ
        </p>
      </div>
    </div>
  );
}
