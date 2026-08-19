'use client';

import { useState } from 'react';
import type { PatientFormData, ValidationErrors } from '@/types/patient';
import { usePatientWS } from '@/hooks/usePatientWS';
import FormSection from './FormSection';
import FormField from './FormField';
import NationalitySelect from './NationalitySelect';
import SelectWithOther from './SelectWithOther';

const INITIAL_DATA: PatientFormData = {
  first_name_th: '',
  middle_name_th: '',
  last_name_th: '',
  first_name_en: '',
  middle_name_en: '',
  last_name_en: '',
  national_id: '',
  passport_id: '',
  date_of_birth: '',
  gender: '',
  nationality: '',
  phone_number: '',
  email: '',
  address: '',
  preferred_language: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  religion: '',
};

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const LANGUAGE_OPTIONS = [
  { value: 'Thai', label: 'Thai' },
  { value: 'English', label: 'English' },
  { value: 'Chinese', label: 'Chinese (Mandarin)' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Arabic', label: 'Arabic' },
];

const RELIGION_OPTIONS = [
  { value: 'Buddhism', label: 'Buddhism' },
  { value: 'Christianity', label: 'Christianity' },
  { value: 'Islam', label: 'Islam' },
  { value: 'Hinduism', label: 'Hinduism' },
  { value: 'Sikhism', label: 'Sikhism' },
  { value: 'None', label: 'No religion' },
];

const THAI_ONLY = /^[฀-๿\s]+$/;
const EN_ONLY = /^[a-zA-Z\s'\-]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;
const PASSPORT_REGEX = /^[A-Z0-9]{5,20}$/i;

export function validate(data: PatientFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.first_name_th.trim()) {
    errors.first_name_th = 'Thai first name is required';
  } else if (!THAI_ONLY.test(data.first_name_th.trim())) {
    errors.first_name_th = 'Thai first name must contain Thai characters only';
  }

  if (data.middle_name_th.trim() && !THAI_ONLY.test(data.middle_name_th.trim())) {
    errors.middle_name_th = 'Thai middle name must contain Thai characters only';
  }

  if (!data.last_name_th.trim()) {
    errors.last_name_th = 'Thai last name is required';
  } else if (!THAI_ONLY.test(data.last_name_th.trim())) {
    errors.last_name_th = 'Thai last name must contain Thai characters only';
  }

  if (data.first_name_en.trim() && !EN_ONLY.test(data.first_name_en.trim())) {
    errors.first_name_en = 'First name must contain English letters only';
  }

  if (data.middle_name_en.trim() && !EN_ONLY.test(data.middle_name_en.trim())) {
    errors.middle_name_en = 'Middle name must contain English letters only';
  }

  if (data.last_name_en.trim() && !EN_ONLY.test(data.last_name_en.trim())) {
    errors.last_name_en = 'Last name must contain English letters only';
  }

  if (!data.date_of_birth) {
    errors.date_of_birth = 'Date of birth is required';
  } else {
    const now = new Date();
    const todayLocal = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');
    if (data.date_of_birth > todayLocal) {
      errors.date_of_birth = 'Date of birth cannot be in the future';
    }
  }

  if (!data.gender) errors.gender = 'Gender is required';

  const hasNationalId = !!data.national_id.trim();
  const hasPassportId = !!data.passport_id.trim();

  if (!hasNationalId && !hasPassportId) {
    const msg = 'Please provide either a National ID or Passport number';
    errors.national_id = msg;
    errors.passport_id = msg;
  } else {
    if (hasNationalId && !/^\d{13}$/.test(data.national_id)) {
      errors.national_id = 'National ID must be exactly 13 digits';
    }
    if (hasPassportId && !PASSPORT_REGEX.test(data.passport_id)) {
      errors.passport_id = 'Passport number must be 5–20 alphanumeric characters';
    }
  }

  if (data.phone_number && !PHONE_REGEX.test(data.phone_number)) {
    errors.phone_number = 'Invalid phone number format';
  }

  if (data.emergency_contact_phone && !PHONE_REGEX.test(data.emergency_contact_phone)) {
    errors.emergency_contact_phone = 'Invalid phone number format';
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email address';
  }

  return errors;
}

type PatientFormProps = {
  hospitalCode: string;
};

export default function PatientForm({ hospitalCode }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const { wsStatus, sendFillingDebounced, sendSubmitted } = usePatientWS(hospitalCode);

  function handleChange(name: keyof PatientFormData, value: string) {
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (hasSubmitted) {
      setErrors(validate(updated));
    }
    sendFillingDebounced(updated);
  }

  function handleSubmit() {
    const newErrors = validate(formData);
    setErrors(newErrors);
    setHasSubmitted(true);
    if (Object.keys(newErrors).length === 0) {
      sendSubmitted(formData);
      setIsSuccess(true);
    }
  }

  function handleReset() {
    setFormData(INITIAL_DATA);
    setErrors({});
    setHasSubmitted(false);
    setIsSuccess(false);
    setResetKey((k) => k + 1);
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Registration Complete!</h2>
        <p className="mb-10 text-slate-500">Your information has been saved successfully.</p>
        <button
          onClick={handleReset}
          className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Register Again
        </button>
      </div>
    );
  }

  const err = (field: keyof PatientFormData) =>
    hasSubmitted ? errors[field] : undefined;

  return (
    <div className="space-y-10">
      {/* WebSocket connection status banner */}
      {wsStatus !== 'connected' && (
        <div
          role="status"
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
            wsStatus === 'connecting'
              ? 'border-amber-200 bg-amber-50 text-amber-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          <span
            className={`size-2 shrink-0 rounded-full ${
              wsStatus === 'connecting' ? 'animate-pulse bg-amber-500' : 'bg-red-500'
            }`}
          />
          {wsStatus === 'connecting'
            ? 'กำลังเชื่อมต่อ — ข้อมูลจะถูกส่งแบบ real-time เมื่อเชื่อมต่อสำเร็จ'
            : 'ขาดการเชื่อมต่อ — ข้อมูลที่กรอกจะไม่ถูกส่งแบบ real-time'}
        </div>
      )}

      <FormSection number={1} title="Name">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField
            label="First Name (Thai)"
            name="first_name_th"
            placeholder="ชื่อภาษาไทย"
            required
            value={formData.first_name_th}
            error={err('first_name_th')}
            onChange={handleChange}
          />
          <FormField
            label="Middle Name (Thai)"
            name="middle_name_th"
            placeholder="ชื่อกลางภาษาไทย"
            value={formData.middle_name_th}
            error={err('middle_name_th')}
            onChange={handleChange}
          />
          <FormField
            label="Last Name (Thai)"
            name="last_name_th"
            placeholder="นามสกุลภาษาไทย"
            required
            value={formData.last_name_th}
            error={err('last_name_th')}
            onChange={handleChange}
          />
          <FormField
            label="First Name (English)"
            name="first_name_en"
            placeholder="e.g. John"
            value={formData.first_name_en}
            error={err('first_name_en')}
            onChange={handleChange}
          />
          <FormField
            label="Middle Name (English)"
            name="middle_name_en"
            placeholder="e.g. Robert"
            value={formData.middle_name_en}
            error={err('middle_name_en')}
            onChange={handleChange}
          />
          <FormField
            label="Last Name (English)"
            name="last_name_en"
            placeholder="e.g. Smith"
            value={formData.last_name_en}
            error={err('last_name_en')}
            onChange={handleChange}
          />
        </div>
      </FormSection>

      <FormSection number={2} title="Identity">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="National ID"
            name="national_id"
            placeholder="13-digit national ID number"
            value={formData.national_id}
            error={err('national_id')}
            onChange={handleChange}
          />
          <FormField
            label="Passport Number"
            name="passport_id"
            placeholder="e.g. AA1234567"
            value={formData.passport_id}
            error={err('passport_id')}
            onChange={handleChange}
          />
          <FormField
            label="Date of Birth"
            name="date_of_birth"
            type="date"
            required
            max={new Date().toISOString().split('T')[0]}
            value={formData.date_of_birth}
            error={err('date_of_birth')}
            onChange={handleChange}
          />
          <FormField
            label="Gender"
            name="gender"
            type="select"
            required
            value={formData.gender}
            error={err('gender')}
            options={GENDER_OPTIONS}
            onChange={handleChange}
          />
          <div className="sm:col-span-2">
            <NationalitySelect
              key={resetKey}
              value={formData.nationality}
              error={err('nationality')}
              onChange={(value) => handleChange('nationality', value)}
            />
          </div>
        </div>
      </FormSection>

      <FormSection number={3} title="Contact">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Phone Number"
            name="phone_number"
            type="tel"
            placeholder="e.g. +66 81 234 5678"
            value={formData.phone_number}
            error={err('phone_number')}
            onChange={handleChange}
          />
          <FormField
            label="Email Address"
            name="email"
            type="email"
            placeholder="e.g. john@example.com"
            value={formData.email}
            error={err('email')}
            onChange={handleChange}
          />
        </div>
        <FormField
          label="Address"
          name="address"
          type="textarea"
          placeholder="Full address"
          value={formData.address}
          error={err('address')}
          onChange={handleChange}
        />
      </FormSection>

      <FormSection number={4} title="Additional Information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectWithOther
            key={`lang-${resetKey}`}
            label="Preferred Language"
            value={formData.preferred_language}
            options={LANGUAGE_OPTIONS}
            error={err('preferred_language')}
            otherPlaceholder="Please specify language"
            onChange={(value) => handleChange('preferred_language', value)}
          />
          <SelectWithOther
            key={`rel-${resetKey}`}
            label="Religion"
            value={formData.religion}
            options={RELIGION_OPTIONS}
            error={err('religion')}
            otherPlaceholder="Please specify religion"
            onChange={(value) => handleChange('religion', value)}
          />
          <FormField
            label="Emergency Contact Name"
            name="emergency_contact_name"
            placeholder="Full name"
            value={formData.emergency_contact_name}
            error={err('emergency_contact_name')}
            onChange={handleChange}
          />
          <FormField
            label="Emergency Contact Phone"
            name="emergency_contact_phone"
            type="tel"
            placeholder="e.g. +66 81 234 5678"
            value={formData.emergency_contact_phone}
            error={err('emergency_contact_phone')}
            onChange={handleChange}
          />
        </div>
      </FormSection>

      {hasSubmitted && Object.keys(errors).length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 4a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0V5zm.75 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </svg>
          <p className="text-sm text-red-700">
            {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? 's have' : ' has'} errors. Please review and correct them before submitting.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 pt-6">
        <p className="text-xs text-slate-400">
          <span className="text-red-500">*</span> Required fields
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-xl bg-blue-600 px-10 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Register
        </button>
      </div>
    </div>
  );
}
