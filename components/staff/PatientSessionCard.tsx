import type { StaffSessionMessage, PatientSessionData, SessionStatus } from '@/types/staff';
import { StatusBadge } from './StatusBadge';
import { formatRelativeTime, formatThaiDate } from '@/lib/utils/time';

interface PatientSessionCardProps {
  session: StaffSessionMessage;
}

const GENDER_LABEL: Record<string, string> = {
  male: 'ชาย',
  female: 'หญิง',
  other: 'อื่นๆ',
};

const STATUS_BORDER: Record<SessionStatus, string> = {
  filling: 'border-l-4 border-blue-400',
  submitted: 'border-l-4 border-green-500',
  inactive: 'border-l-4 border-slate-300',
};

// ── Small reusable pieces ─────────────────────────────────────────────────────

function IdIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function InfoBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800 break-all">{value}</p>
      </div>
    </div>
  );
}

function ContactRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-700">
      <span className="shrink-0 text-slate-400" aria-hidden="true">
        {icon}
      </span>
      <span className="break-all">{value}</span>
    </div>
  );
}

// ── Main sections ─────────────────────────────────────────────────────────────

function PatientDataSection({ data }: { data: PatientSessionData }) {
  const nameTh = [data.first_name_th, data.middle_name_th, data.last_name_th]
    .filter(Boolean)
    .join(' ');
  const nameEn = [data.first_name_en, data.middle_name_en, data.last_name_en]
    .filter(Boolean)
    .join(' ');

  const idValue = data.national_id ?? data.passport_id;
  const idLabel = data.national_id ? 'บัตรประชาชน' : 'พาสปอร์ต';

  const dobGender = [
    data.date_of_birth ? formatThaiDate(data.date_of_birth) : null,
    data.gender ? GENDER_LABEL[data.gender] : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const tags = [
    { key: 'nationality', value: data.nationality },
    { key: 'preferred_language', value: data.preferred_language },
    { key: 'religion', value: data.religion },
  ].filter((t): t is { key: string; value: string } => Boolean(t.value));

  return (
    <div className="px-5 pb-5 space-y-4">
      {/* Hero: name + HN */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {nameTh && (
            <p className="text-base font-semibold text-slate-900 leading-snug">{nameTh}</p>
          )}
          {nameEn && <p className="text-sm text-slate-500">{nameEn}</p>}
          {!nameTh && !nameEn && (
            <p className="text-sm text-slate-400 italic">ยังไม่ได้กรอกชื่อ</p>
          )}
        </div>
        {data.patient_hn && (
          <span className="shrink-0 rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
            {data.patient_hn}
          </span>
        )}
      </div>

      {/* Identity: ID card / DOB+gender */}
      {(idValue || dobGender) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {idValue && <InfoBlock icon={<IdIcon />} label={idLabel} value={idValue} />}
          {dobGender && <InfoBlock icon={<CalendarIcon />} label="วันเกิด / เพศ" value={dobGender} />}
        </div>
      )}

      {/* Contact */}
      {(data.phone_number || data.email) && (
        <div className="space-y-1.5">
          {data.phone_number && <ContactRow icon={<PhoneIcon />} value={data.phone_number} />}
          {data.email && <ContactRow icon={<EmailIcon />} value={data.email} />}
        </div>
      )}

      {/* Address */}
      {data.address && (
        <InfoBlock icon={<LocationIcon />} label="ที่อยู่" value={data.address} />
      )}

      {/* Optional tag pills */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(({ key, value }) => (
            <span
              key={key}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600"
            >
              {value}
            </span>
          ))}
        </div>
      )}

      {/* Emergency contact */}
      {(data.emergency_contact_name || data.emergency_contact_phone) && (
        <div className="rounded-lg bg-red-50 px-3 py-2.5 ring-1 ring-red-100">
          <p className="mb-1 text-xs font-semibold text-red-600">ผู้ติดต่อฉุกเฉิน</p>
          <p className="text-sm text-slate-800">
            {[data.emergency_contact_name, data.emergency_contact_phone]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
      )}
    </div>
  );
}

function InactiveBody() {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
      <div
        className="mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100"
        aria-hidden="true"
      >
        <svg
          className="size-6 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-500">Session สิ้นสุดแล้ว</p>
      <p className="mt-0.5 text-xs text-slate-400">ผู้ป่วยออกจากระบบหรือหมดเวลา</p>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

export function PatientSessionCard({ session }: PatientSessionCardProps) {
  const { session_id, status, data, timestamp } = session;

  const isInactive = status === 'inactive';

  return (
    <article
      className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 ${STATUS_BORDER[status]} ${isInactive ? 'opacity-60' : ''}`}
      aria-label={
        data
          ? `Session ของ ${[data.first_name_th, data.last_name_th].filter(Boolean).join(' ') || session_id}`
          : `Session สิ้นสุด`
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <StatusBadge status={status} />
        <time
          className="shrink-0 text-xs text-slate-400"
          dateTime={timestamp}
          title={new Date(timestamp).toLocaleString('th-TH')}
        >
          {formatRelativeTime(timestamp)}
        </time>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-slate-100" />

      {/* Body */}
      <div className="pt-4">
        {data ? <PatientDataSection data={data} /> : <InactiveBody />}
      </div>
    </article>
  );
}
