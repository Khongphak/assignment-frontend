'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth/token';
import { logoutAction } from '@/app/actions/auth';
import { useStaffWS } from '@/hooks/useStaffWS';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';
import { PatientSessionCard } from '@/components/staff/PatientSessionCard';
import type { StaffSessionMessage, SessionStatus } from '@/types/staff';

type FilterValue = SessionStatus | 'all';

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'filling', label: 'กำลังกรอก' },
  { value: 'submitted', label: 'ส่งแล้ว' },
  { value: 'inactive', label: 'ไม่ใช้งาน' },
];

function countByStatus(sessions: StaffSessionMessage[], status: SessionStatus) {
  return sessions.filter((s) => s.status === status).length;
}

export default function StaffViewPage() {
  const router = useRouter();
  const { tokenMissing: refreshTokenMissing, ready } = useTokenRefresh();
  const { sessions, wsStatus, tokenMissing } = useStaffWS(!ready);
  const [filter, setFilter] = useState<FilterValue>('all');

  useEffect(() => {
    if (tokenMissing || refreshTokenMissing) {
      router.replace('/staff');
    }
  }, [tokenMissing, refreshTokenMissing, router]);

  async function handleLogout() {
    await logoutAction();
    clearToken();
    router.push('/staff');
  }

  const filtered =
    filter === 'all' ? sessions : sessions.filter((s) => s.status === filter);

  const counts = {
    all: sessions.length,
    filling: countByStatus(sessions, 'filling'),
    submitted: countByStatus(sessions, 'submitted'),
    inactive: countByStatus(sessions, 'inactive'),
  };

  if (wsStatus === 'connecting' && sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span
            className="size-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
            role="status"
            aria-label="กำลังเชื่อมต่อ"
          />
          <p className="text-sm text-slate-500">กำลังเชื่อมต่อ…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sticky top nav */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div
              className="flex size-7 items-center justify-center rounded-lg bg-blue-600"
              aria-hidden="true"
            >
              <svg
                className="size-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-900">Staff View</span>
            {/* WebSocket connection status */}
            <span
              className={`ml-1 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                wsStatus === 'connected'
                  ? 'bg-green-50 text-green-700'
                  : wsStatus === 'connecting'
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  wsStatus === 'connected'
                    ? 'animate-pulse bg-green-500'
                    : wsStatus === 'connecting'
                    ? 'animate-pulse bg-amber-500'
                    : 'bg-red-500'
                }`}
              />
              {wsStatus === 'connected'
                ? 'Live'
                : wsStatus === 'connecting'
                ? 'กำลังเชื่อมต่อ'
                : 'ขาดการเชื่อมต่อ'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-700"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            ออกจากระบบ
          </button>
        </div>
      </header>

      {/* Disconnected warning banner */}
      {wsStatus === 'disconnected' && (
        <div
          role="alert"
          className="border-b border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-700 sm:px-6"
        >
          ขาดการเชื่อมต่อ — ข้อมูลอาจไม่เป็นปัจจุบัน กรุณารีเฟรชหน้า
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Session ผู้ป่วย</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Real-time — {sessions.length} session ทั้งหมด
          </p>
        </div>

        {/* Filter tabs / summary cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FILTER_OPTIONS.map(({ value, label }) => {
            const isActive = filter === value;
            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`rounded-xl px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                }`}
                aria-pressed={isActive}
              >
                <div
                  className={`text-2xl font-bold tabular-nums ${isActive ? 'text-white' : 'text-slate-900'}`}
                >
                  {counts[value]}
                </div>
                <div className={`mt-0.5 text-xs ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                  {label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Session grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">
            {wsStatus === 'connected'
              ? 'ไม่มี session ที่ตรงกับตัวกรองนี้'
              : 'รอการเชื่อมต่อ WebSocket…'}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((session) => (
              <PatientSessionCard key={session.session_id} session={session} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
