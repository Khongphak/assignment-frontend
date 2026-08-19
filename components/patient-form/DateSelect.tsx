import type { PatientFormData } from '@/types/patient';

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

function getDaysInMonth(month: string, year: string): number {
  if (!month || !year) return 31;
  return new Date(+year, +month, 0).getDate();
}

function parseDate(value: string) {
  if (!value) return { year: '', month: '', day: '' };
  const [y, m, d] = value.split('-');
  return {
    year: y ?? '',
    month: m ? String(+m) : '',
    day: d ? String(+d) : '',
  };
}

function combine(year: string, month: string, day: string): string {
  if (!year || !month || !day) return '';
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

type DateSelectProps = {
  label: string;
  name: keyof PatientFormData;
  required?: boolean;
  value: string;
  error?: string;
  maxYear?: number;
  onChange: (name: keyof PatientFormData, value: string) => void;
};

export default function DateSelect({
  label,
  name,
  required,
  value,
  error,
  maxYear,
  onChange,
}: DateSelectProps) {
  const { year, month, day } = parseDate(value);
  const currentYear = maxYear ?? new Date().getFullYear();
  const daysInMonth = getDaysInMonth(month, year);

  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function handleDay(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange(name, combine(year, month, e.target.value));
  }

  function handleMonth(e: React.ChangeEvent<HTMLSelectElement>) {
    const newMonth = e.target.value;
    const maxDay = getDaysInMonth(newMonth, year);
    const clampedDay = day && +day > maxDay ? String(maxDay) : day;
    onChange(name, combine(year, newMonth, clampedDay));
  }

  function handleYear(e: React.ChangeEvent<HTMLSelectElement>) {
    const newYear = e.target.value;
    const maxDay = getDaysInMonth(month, newYear);
    const clampedDay = day && +day > maxDay ? String(maxDay) : day;
    onChange(name, combine(newYear, month, clampedDay));
  }

  const base = `h-10 w-full rounded-lg border text-sm text-slate-900 px-2 shadow-sm transition-all appearance-none focus:outline-none focus:ring-2`;
  const cls = error
    ? `${base} border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20`
    : `${base} border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-500/20`;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-3 gap-2">
        <select value={day} onChange={handleDay} className={cls}>
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d} value={String(d)}>{d}</option>
          ))}
        </select>
        <select value={month} onChange={handleMonth} className={cls}>
          <option value="">Month</option>
          {MONTHS.map((m, i) => (
            <option key={i} value={String(i + 1)}>{m}</option>
          ))}
        </select>
        <select value={year} onChange={handleYear} className={cls}>
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      </div>
      {error && (
        <div className="flex items-start gap-1.5">
          <svg className="mt-px h-3.5 w-3.5 shrink-0 text-red-500" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 4a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0V5zm.75 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </svg>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
