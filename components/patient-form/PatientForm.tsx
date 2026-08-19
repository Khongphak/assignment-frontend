'use client';

import { useState } from 'react';
import type { PatientFormData, ValidationErrors } from '@/types/patient';
import FormSection from './FormSection';
import FormField from './FormField';

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
  { value: 'male', label: 'ชาย' },
  { value: 'female', label: 'หญิง' },
  { value: 'other', label: 'อื่นๆ' },
];

export function validate(data: PatientFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.first_name_th.trim()) errors.first_name_th = 'กรุณากรอกชื่อภาษาไทย';
  if (!data.last_name_th.trim()) errors.last_name_th = 'กรุณากรอกนามสกุลภาษาไทย';

  if (!data.date_of_birth) {
    errors.date_of_birth = 'กรุณากรอกวันเกิด';
  } else {
    const now = new Date();
    const todayLocal = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');
    if (data.date_of_birth > todayLocal) {
      errors.date_of_birth = 'วันเกิดต้องไม่เป็นวันในอนาคต';
    }
  }

  if (!data.gender) errors.gender = 'กรุณาเลือกเพศ';

  const hasNationalId = !!data.national_id.trim();
  const hasPassportId = !!data.passport_id.trim();

  if (!hasNationalId && !hasPassportId) {
    const msg = 'กรุณากรอกเลขบัตรประชาชนหรือหมายเลขพาสปอร์ตอย่างน้อย 1 อย่าง';
    errors.national_id = msg;
    errors.passport_id = msg;
  } else if (hasNationalId && !/^\d{13}$/.test(data.national_id)) {
    errors.national_id = 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลักเท่านั้น';
  }

  if (data.phone_number && !/^[0-9+\-\s()]{7,20}$/.test(data.phone_number)) {
    errors.phone_number = 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง';
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
  }

  return errors;
}

function todayString() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}

type PatientFormProps = {
  hospitalCode: string;
};

export default function PatientForm({ hospitalCode: _hospitalCode }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(name: keyof PatientFormData, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);
    setHasSubmitted(true);
    if (Object.keys(newErrors).length === 0) {
      setIsSuccess(true);
    }
  }

  function handleReset() {
    setFormData(INITIAL_DATA);
    setErrors({});
    setHasSubmitted(false);
    setIsSuccess(false);
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">ลงทะเบียนสำเร็จ</h2>
        <p className="mb-8 text-gray-500">ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว</p>
        <button
          onClick={handleReset}
          className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          ลงทะเบียนใหม่
        </button>
      </div>
    );
  }

  const err = (field: keyof PatientFormData) =>
    hasSubmitted ? errors[field] : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <FormSection title="ชื่อ (Name)">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField
            label="ชื่อ (ภาษาไทย)"
            name="first_name_th"
            required
            value={formData.first_name_th}
            error={err('first_name_th')}
            onChange={handleChange}
          />
          <FormField
            label="ชื่อกลาง (ภาษาไทย)"
            name="middle_name_th"
            value={formData.middle_name_th}
            error={err('middle_name_th')}
            onChange={handleChange}
          />
          <FormField
            label="นามสกุล (ภาษาไทย)"
            name="last_name_th"
            required
            value={formData.last_name_th}
            error={err('last_name_th')}
            onChange={handleChange}
          />
          <FormField
            label="First Name (English)"
            name="first_name_en"
            value={formData.first_name_en}
            error={err('first_name_en')}
            onChange={handleChange}
          />
          <FormField
            label="Middle Name (English)"
            name="middle_name_en"
            value={formData.middle_name_en}
            error={err('middle_name_en')}
            onChange={handleChange}
          />
          <FormField
            label="Last Name (English)"
            name="last_name_en"
            value={formData.last_name_en}
            error={err('last_name_en')}
            onChange={handleChange}
          />
        </div>
      </FormSection>

      <FormSection title="ข้อมูลตัวตน (Identity)">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="เลขบัตรประชาชน"
            name="national_id"
            placeholder="เลขบัตรประชาชน 13 หลัก"
            value={formData.national_id}
            error={err('national_id')}
            onChange={handleChange}
          />
          <FormField
            label="หมายเลขพาสปอร์ต"
            name="passport_id"
            value={formData.passport_id}
            error={err('passport_id')}
            onChange={handleChange}
          />
          <FormField
            label="วันเกิด"
            name="date_of_birth"
            type="date"
            required
            max={todayString()}
            value={formData.date_of_birth}
            error={err('date_of_birth')}
            onChange={handleChange}
          />
          <FormField
            label="เพศ"
            name="gender"
            type="select"
            required
            value={formData.gender}
            error={err('gender')}
            options={GENDER_OPTIONS}
            onChange={handleChange}
          />
          <FormField
            label="สัญชาติ"
            name="nationality"
            value={formData.nationality}
            error={err('nationality')}
            onChange={handleChange}
          />
        </div>
      </FormSection>

      <FormSection title="ช่องทางติดต่อ (Contact)">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="หมายเลขโทรศัพท์"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            error={err('phone_number')}
            onChange={handleChange}
          />
          <FormField
            label="อีเมล"
            name="email"
            type="email"
            value={formData.email}
            error={err('email')}
            onChange={handleChange}
          />
        </div>
        <FormField
          label="ที่อยู่"
          name="address"
          type="textarea"
          value={formData.address}
          error={err('address')}
          onChange={handleChange}
        />
      </FormSection>

      <FormSection title="ข้อมูลเพิ่มเติม (Additional)">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="ภาษาที่ต้องการ"
            name="preferred_language"
            value={formData.preferred_language}
            error={err('preferred_language')}
            onChange={handleChange}
          />
          <FormField
            label="ศาสนา"
            name="religion"
            value={formData.religion}
            error={err('religion')}
            onChange={handleChange}
          />
          <FormField
            label="ชื่อผู้ติดต่อฉุกเฉิน"
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            error={err('emergency_contact_name')}
            onChange={handleChange}
          />
          <FormField
            label="เบอร์โทรผู้ติดต่อฉุกเฉิน"
            name="emergency_contact_phone"
            type="tel"
            value={formData.emergency_contact_phone}
            error={err('emergency_contact_phone')}
            onChange={handleChange}
          />
        </div>
      </FormSection>

      {hasSubmitted && Object.keys(errors).length > 0 && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          กรุณาตรวจสอบข้อมูลที่ไม่ถูกต้องก่อนส่งแบบฟอร์ม
        </p>
      )}

      <div className="flex justify-end border-t border-gray-100 pt-6">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          ลงทะเบียน
        </button>
      </div>
    </form>
  );
}
