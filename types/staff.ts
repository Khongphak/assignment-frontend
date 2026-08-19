import type { Gender } from './patient';

export type SessionStatus = 'filling' | 'submitted' | 'inactive';

// All fields that may appear in the /ws/staff broadcast data.
// Mirrors PatientFormData from types/patient.ts plus the server-assigned patient_hn.
// All fields are optional — data arrives incrementally as the patient fills the form.
export interface PatientSessionData {
  // Core fields from GET /patient/search response (patient_handler.go)
  patient_hn?: string;
  national_id?: string | null;
  passport_id?: string | null;
  first_name_th?: string;
  last_name_th?: string;
  first_name_en?: string | null;
  last_name_en?: string | null;
  date_of_birth?: string; // YYYY-MM-DD
  gender?: Gender;
  phone_number?: string | null;
  email?: string | null;
  // Additional WebSocket data fields — dynamic, may be absent in some sessions
  middle_name_th?: string;
  middle_name_en?: string;
  nationality?: string;
  preferred_language?: string;
  religion?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

// Exact shape of messages received on /ws/staff.
// Keep 1:1 with the Broadcast and Inactive contracts in documents/BE-docs/websocket-guide.md §10.
export interface StaffSessionMessage {
  type: 'form_update';
  session_id: string; // UUID v4
  status: SessionStatus;
  data: PatientSessionData | null; // null when status is 'inactive'
  timestamp: string; // ISO 8601, e.g. "2026-08-19T10:00:00Z"
}

// POST /staff/login — request body
export interface StaffLoginRequest {
  username: string;
  password: string;
  hospital_code: string;
}

// POST /staff/login — response body
export interface StaffLoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds (900 = 15 min)
}
