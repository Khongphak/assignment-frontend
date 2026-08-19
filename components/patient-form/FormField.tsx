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
  const base =
    'w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';
  const inputClass = error
    ? `${base} border-red-400 bg-red-50`
    : `${base} border-gray-300 bg-white`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {type === 'select' && options ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={inputClass}
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
          className={inputClass}
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
          className={inputClass}
        />
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
