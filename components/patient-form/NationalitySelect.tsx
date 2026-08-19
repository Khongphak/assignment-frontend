'use client';

import { useState, useRef, useEffect } from 'react';

type NationalityEntry = { code: string; name: string };

const NATIONALITIES: NationalityEntry[] = [
  { code: 'TH', name: 'Thai' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'KH', name: 'Cambodian' },
  { code: 'LA', name: 'Lao' },
  { code: 'VN', name: 'Vietnamese' },
  { code: 'MY', name: 'Malaysian' },
  { code: 'SG', name: 'Singaporean' },
  { code: 'ID', name: 'Indonesian' },
  { code: 'PH', name: 'Filipino' },
  { code: 'BN', name: 'Bruneian' },
  { code: 'CN', name: 'Chinese' },
  { code: 'JP', name: 'Japanese' },
  { code: 'KR', name: 'Korean' },
  { code: 'TW', name: 'Taiwanese' },
  { code: 'IN', name: 'Indian' },
  { code: 'PK', name: 'Pakistani' },
  { code: 'BD', name: 'Bangladeshi' },
  { code: 'US', name: 'American' },
  { code: 'GB', name: 'British' },
  { code: 'AU', name: 'Australian' },
  { code: 'DE', name: 'German' },
  { code: 'FR', name: 'French' },
  { code: 'CA', name: 'Canadian' },
  { code: 'NL', name: 'Dutch' },
];

const KNOWN_NAMES = new Set(NATIONALITIES.map((n) => n.name));

function FlagImg({ code, name }: { code: string; name: string }) {
  return (
    <img
      src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w40/${code.toLowerCase()}.png 2x`}
      width={20}
      height={15}
      alt={name}
      className="shrink-0 rounded-sm object-cover"
    />
  );
}

function GlobeIcon() {
  return (
    <svg className="h-[15px] w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

type NationalitySelectProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export default function NationalitySelect({ value, error, onChange }: NationalitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Removed value-sync useEffect: it cancelled custom mode immediately after selecting "Other".
  // Reset is handled by the `key` prop in the parent (PatientForm).
  const [isCustom, setIsCustom] = useState(() => !!value && !KNOWN_NAMES.has(value));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  function handleSelect(entry: NationalityEntry) {
    setIsOpen(false);
    onChange(entry.name);
  }

  function handleOther() {
    setIsCustom(true);
    setIsOpen(false);
    onChange('');
  }

  function handleBack() {
    setIsCustom(false);
    onChange('');
  }

  const selectedEntry = KNOWN_NAMES.has(value)
    ? NATIONALITIES.find((n) => n.name === value) ?? null
    : null;

  const borderCls = error
    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
    : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-500/20';
  const triggerCls = `flex h-10 w-full items-center justify-between rounded-lg border px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 ${borderCls}`;
  const inputCls = `h-10 w-full rounded-lg border px-3.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:outline-none focus:ring-2 ${borderCls}`;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">Nationality</span>
      <div ref={containerRef} className="relative">
        {isCustom ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              placeholder="Please specify"
              autoFocus
              onChange={(e) => onChange(e.target.value)}
              className={inputCls}
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
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className={triggerCls}
          >
            <span className={`flex items-center gap-2.5 ${selectedEntry ? 'text-slate-900' : 'text-slate-400'}`}>
              {selectedEntry ? (
                <>
                  <FlagImg code={selectedEntry.code} name={selectedEntry.name} />
                  <span>{selectedEntry.name}</span>
                </>
              ) : (
                <span>-- Select nationality --</span>
              )}
            </span>
            <svg
              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {isOpen && !isCustom && (
          <ul role="listbox" className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
            {NATIONALITIES.map((entry) => (
              <li key={entry.code} role="option" aria-selected={entry.name === value}>
                <button
                  type="button"
                  onClick={() => handleSelect(entry)}
                  className={`flex w-full items-center gap-3 px-3.5 py-2 text-sm transition-colors hover:bg-blue-50 hover:text-blue-700 ${
                    entry.name === value ? 'bg-blue-50 font-medium text-blue-700' : 'text-slate-700'
                  }`}
                >
                  <FlagImg code={entry.code} name={entry.name} />
                  <span>{entry.name}</span>
                </button>
              </li>
            ))}
            <li role="option" aria-selected={false} className="border-t border-slate-100">
              <button
                type="button"
                onClick={handleOther}
                className="flex w-full items-center gap-3 px-3.5 py-2 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <GlobeIcon />
                <span>Other (specify)</span>
              </button>
            </li>
          </ul>
        )}
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
