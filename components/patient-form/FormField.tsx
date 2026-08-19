import type { PatientFormData } from '@/types/patient';

type SelectOption = { value: string; label: string };

type FormFieldProps = {
  label: string;
  name: keyof PatientFormData;
  type?: 'text' | 'date' | 'email' | 'tel' | 'select' | 'textarea';
  required?: boolean;
  value: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
  max?: string;
  onChange: (name: keyof PatientFormData, value: string) => void;
};

const base =
  'w-full rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:outline-none focus:ring-2';
const normal = `${base} border-slate-200 bg-white px-3.5 focus:border-blue-500 focus:ring-blue-500/20`;
const hasError = `${base} border-red-400 bg-red-50 px-3.5 focus:border-red-500 focus:ring-red-500/20`;

export default function FormField({
  label,
  name,
  type = 'text',
  required = false,
  value,
  error,
  options,
  placeholder,
  max,
  onChange,
}: FormFieldProps) {
  const inputClass = error ? hasError : normal;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {type === 'select' && options ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={`${inputClass} h-10 appearance-none`}
        >
          <option value="">-- เลือก --</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          rows={3}
          onChange={(e) => onChange(name, e.target.value)}
          className={`${inputClass} py-2.5`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          max={max}
          onChange={(e) => onChange(name, e.target.value)}
          className={`${inputClass} h-10`}
        />
      )}

      {error && (
        <div className="flex items-start gap-1.5">
          <svg
            className="mt-px h-3.5 w-3.5 shrink-0 text-red-500"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 4a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0V5zm.75 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </svg>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
