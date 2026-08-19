import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PatientSessionCard } from './PatientSessionCard';
import type { StaffSessionMessage } from '@/types/staff';

const BASE_TIME = new Date('2026-08-20T10:00:00Z').getTime();

const FILLING_SESSION: StaffSessionMessage = {
  type: 'form_update',
  session_id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456789',
  status: 'filling',
  data: {
    patient_hn: 'HN001',
    national_id: '1234567890123',
    first_name_th: 'สมชาย',
    last_name_th: 'ใจดี',
    first_name_en: 'Somchai',
    last_name_en: 'Jaidee',
    date_of_birth: '1990-05-15',
    gender: 'male',
    phone_number: '0812345678',
    email: 'somchai@example.com',
  },
  timestamp: new Date(BASE_TIME - 2 * 60 * 1000).toISOString(),
};

const INACTIVE_SESSION: StaffSessionMessage = {
  type: 'form_update',
  session_id: 'c3d4e5f6-a7b8-4901-cdef-012345678901',
  status: 'inactive',
  data: null,
  timestamp: new Date(BASE_TIME - 35 * 60 * 1000).toISOString(),
};

describe('PatientSessionCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(BASE_TIME);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders Thai name as hero text', () => {
    render(<PatientSessionCard session={FILLING_SESSION} />);
    expect(screen.getByText('สมชาย ใจดี')).toBeInTheDocument();
  });

  it('renders English name as secondary text', () => {
    render(<PatientSessionCard session={FILLING_SESSION} />);
    expect(screen.getByText('Somchai Jaidee')).toBeInTheDocument();
  });

  it('renders HN as a badge', () => {
    render(<PatientSessionCard session={FILLING_SESSION} />);
    expect(screen.getByText('HN001')).toBeInTheDocument();
  });

  it('renders national_id under identity block', () => {
    render(<PatientSessionCard session={FILLING_SESSION} />);
    expect(screen.getByText('1234567890123')).toBeInTheDocument();
  });

  it('renders date of birth in Thai format', () => {
    render(<PatientSessionCard session={FILLING_SESSION} />);
    // 1990-05-15 → "15 พ.ค. 2533 · ชาย"
    expect(screen.getByText(/15 พ\.ค\. 2533/)).toBeInTheDocument();
  });

  it('renders gender joined with DOB in the same field', () => {
    render(<PatientSessionCard session={FILLING_SESSION} />);
    // "15 พ.ค. 2533 · ชาย" — DOB and gender are combined into one InfoBlock value
    expect(screen.getByText(/15 พ\.ค\. 2533 · ชาย/)).toBeInTheDocument();
  });

  it('renders phone number', () => {
    render(<PatientSessionCard session={FILLING_SESSION} />);
    expect(screen.getByText('0812345678')).toBeInTheDocument();
  });

  it('renders email', () => {
    render(<PatientSessionCard session={FILLING_SESSION} />);
    expect(screen.getByText('somchai@example.com')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<PatientSessionCard session={FILLING_SESSION} />);
    expect(screen.getByRole('status', { name: 'กำลังกรอก' })).toBeInTheDocument();
  });

  it('renders relative timestamp', () => {
    render(<PatientSessionCard session={FILLING_SESSION} />);
    expect(screen.getByText('2 นาทีที่แล้ว')).toBeInTheDocument();
  });

  it('shows inactive fallback message when data is null', () => {
    render(<PatientSessionCard session={INACTIVE_SESSION} />);
    expect(screen.getByText('Session สิ้นสุดแล้ว')).toBeInTheDocument();
  });

  it('does not render patient name for inactive session', () => {
    render(<PatientSessionCard session={INACTIVE_SESSION} />);
    expect(screen.queryByText('สมชาย ใจดี')).not.toBeInTheDocument();
  });

  it('renders emergency contact as a combined line', () => {
    const session: StaffSessionMessage = {
      ...FILLING_SESSION,
      data: {
        ...FILLING_SESSION.data!,
        emergency_contact_name: 'สมหญิง ใจดี',
        emergency_contact_phone: '0898765432',
      },
    };
    render(<PatientSessionCard session={session} />);
    expect(screen.getByText('ผู้ติดต่อฉุกเฉิน')).toBeInTheDocument();
    expect(screen.getByText('สมหญิง ใจดี · 0898765432')).toBeInTheDocument();
  });

  it('renders nationality/language/religion as tag pills', () => {
    const session: StaffSessionMessage = {
      ...FILLING_SESSION,
      data: { ...FILLING_SESSION.data!, nationality: 'Thai', preferred_language: 'ไทย', religion: 'Buddhism' },
    };
    render(<PatientSessionCard session={session} />);
    expect(screen.getByText('Thai')).toBeInTheDocument();
    expect(screen.getByText('ไทย')).toBeInTheDocument();
    expect(screen.getByText('Buddhism')).toBeInTheDocument();
  });

  it('inactive card has reduced opacity class', () => {
    const { container } = render(<PatientSessionCard session={INACTIVE_SESSION} />);
    expect((container.firstChild as HTMLElement).className).toContain('opacity-60');
  });

  it('applies blue left border for filling status', () => {
    const { container } = render(<PatientSessionCard session={FILLING_SESSION} />);
    expect((container.firstChild as HTMLElement).className).toContain('border-blue-400');
  });
});
