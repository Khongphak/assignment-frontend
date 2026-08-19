'use client';

import { useState } from 'react';

const OTHER = '__other__';

type Option = { value: string; label: string };

type SelectWithOtherProps = {
  label: string;
  required?: boolean;
  value: string;
  options: Option[];
  error?: string;
  otherPlaceholder?: string;
  onChange: (value: string) => void;
};

export default function SelectWithOther({
  label,
  required,
  value,
  options,
  error,
  otherPlaceholder = 'Please specify',
  onChange,
}: SelectWithOtherProps) {
  const knownValues = new Set(options.map((o) => o.value));
  // If current value is non-empty and not a known option → start in custom mode
  const [isCustom, setIsCustom] = useState(() => !!value && !knownValues.has(value));

  const selectDisplayValue = isCustom ? OTHER : knownValues.has(value) ? value : '';

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    if (v === OTHER) {
      setIsCustom(true);
      onChange('');
    } else {
      setIsCustom(false);
      onChange(v);
    }
  }

  function handleBack() {
    setIsCustom(false);
    onChange('');
  }

  const borderCls = error
    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
    : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-500/20';
  const fieldCls = `h-10 w-full rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 px-3.5 shadow-sm transition-all focus:outline-none focus:ring-2 ${borderCls}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {isCustom ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            placeholder={otherPlaceholder}
            autoFocus
            onChange={(e) => onChange(e.target.value)}
            className={fieldCls}
          />
          <button
            type="button"
            onClick={handleBack}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          >
            Back
          </button>
        </div>
      ) : (
        <select
          value={selectDisplayValue}
          onChange={handleSelectChange}
          className={`${fieldCls} appearance-none`}
        >
          <option value="">-- Select --</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
          <option value={OTHER}>Other (specify)</option>
        </select>
      )}

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
