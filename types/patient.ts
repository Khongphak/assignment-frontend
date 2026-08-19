export type Gender = 'male' | 'female' | 'other';

export interface PatientFormData {
  first_name_th: string;
  middle_name_th: string;
  last_name_th: string;
  first_name_en: string;
  middle_name_en: string;
  last_name_en: string;
  national_id: string;
  passport_id: string;
  date_of_birth: string; // YYYY-MM-DD
  gender: Gender | '';
  nationality: string;
  phone_number: string;
  email: string;
  address: string;
  preferred_language: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  religion: string;
}

export type ValidationErrors = Partial<Record<keyof PatientFormData, string>>;
