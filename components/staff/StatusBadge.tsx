import type { SessionStatus } from '@/types/staff';

interface StatusConfig {
  label: string;
  badgeClass: string;
  dotClass: string;
  pulse: boolean;
}

const STATUS_CONFIG: Record<SessionStatus, StatusConfig> = {
  filling: {
    label: 'กำลังกรอก',
    badgeClass: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    dotClass: 'bg-blue-500',
    pulse: true,
  },
  submitted: {
    label: 'ส่งแล้ว',
    badgeClass: 'bg-green-50 text-green-700 ring-1 ring-green-200',
    dotClass: 'bg-green-500',
    pulse: false,
  },
  inactive: {
    label: 'ไม่ใช้งาน',
    badgeClass: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
    dotClass: 'bg-slate-400',
    pulse: false,
  },
};

interface StatusBadgeProps {
  status: SessionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, badgeClass, dotClass, pulse } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
      role="status"
      aria-label={label}
    >
      <span
        className={`size-1.5 rounded-full ${dotClass} ${pulse ? 'animate-pulse' : ''}`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
