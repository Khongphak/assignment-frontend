import type { StaffSessionMessage } from '@/types/staff';

// Minutes-ago helper — produces a fresh ISO timestamp each call.
function minsAgo(n: number): string {
  return new Date(Date.now() - n * 60 * 1000).toISOString();
}

// Static fixture data (without timestamps so they stay up-to-date when getMockSessions is called).
// Shape is 1:1 with the BE-5 /ws/staff broadcast contract (websocket-guide.md §10).
type SessionBase = Omit<StaffSessionMessage, 'timestamp'>;

const SESSION_BASES: SessionBase[] = [
  {
    type: 'form_update',
    session_id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456789',
    status: 'filling',
    data: {
      patient_hn: 'HN2026001',
      national_id: '1234567890123',
      passport_id: null,
      first_name_th: 'สมชาย',
      last_name_th: 'ใจดี',
      first_name_en: 'Somchai',
      last_name_en: 'Jaidee',
      date_of_birth: '1990-05-15',
      gender: 'male',
      phone_number: '0812345678',
      email: 'somchai@example.com',
      nationality: 'Thai',
      preferred_language: 'Thai',
      religion: 'Buddhism',
      address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110',
      emergency_contact_name: 'สมหญิง ใจดี',
      emergency_contact_phone: '0898765432',
    },
  },
  {
    type: 'form_update',
    session_id: 'b2c3d4e5-f6a7-489b-bcde-f01234567890',
    status: 'submitted',
    data: {
      patient_hn: 'HN2026002',
      national_id: null,
      passport_id: 'AB123456',
      first_name_th: 'มาเรีย',
      last_name_th: 'ซานเชซ',
      first_name_en: 'Maria',
      last_name_en: 'Sanchez',
      date_of_birth: '1985-11-22',
      gender: 'female',
      phone_number: '0823456789',
      email: 'maria@example.com',
      nationality: 'Spanish',
      preferred_language: 'English',
      religion: 'Christianity',
    },
  },
  {
    type: 'form_update',
    session_id: 'c3d4e5f6-a7b8-4901-cdef-012345678901',
    status: 'inactive',
    data: null,
  },
  {
    type: 'form_update',
    session_id: 'd4e5f6a7-b8c9-4012-defa-123456789012',
    status: 'filling',
    data: {
      patient_hn: 'HN2026004',
      national_id: '9876543210987',
      passport_id: null,
      first_name_th: 'วิภาวดี',
      last_name_th: 'มีสุข',
      first_name_en: 'Wipawadee',
      last_name_en: 'Meesuk',
      date_of_birth: '2000-03-08',
      gender: 'female',
      phone_number: '0934567890',
      email: null,
      nationality: 'Thai',
    },
  },
  {
    type: 'form_update',
    session_id: 'e5f6a7b8-c901-4123-efab-234567890123',
    status: 'submitted',
    data: {
      patient_hn: 'HN2026005',
      national_id: '1122334455667',
      passport_id: null,
      first_name_th: 'ประสิทธิ์',
      last_name_th: 'งามดี',
      first_name_en: 'Prasit',
      last_name_en: 'Ngamdee',
      date_of_birth: '1975-07-30',
      gender: 'male',
      phone_number: '0845678901',
      email: 'prasit@example.com',
      preferred_language: 'Thai',
      religion: 'Buddhism',
      address: '456 ถนนพระราม 4 ลุมพินี ปทุมวัน กรุงเทพฯ 10330',
      emergency_contact_name: 'ประภา งามดี',
      emergency_contact_phone: '0856789012',
    },
  },
];

// Minute offsets per session — kept outside getMockSessions so timestamps are stable
// across the 8-second polling interval but still feel "live".
const MINS_AGO = [2, 8, 35, 1, 15];

// Returns mock sessions with up-to-date timestamps.
// FE-3: replace callers of this function with a WebSocket accumulator, e.g.:
//   ws.onmessage = (e) => {
//     const msg: StaffSessionMessage = JSON.parse(e.data);
//     setSessions(prev => {
//       const map = new Map(prev.map(s => [s.session_id, s]));
//       map.set(msg.session_id, msg);
//       return Array.from(map.values());
//     });
//   };
export function getMockSessions(): StaffSessionMessage[] {
  return SESSION_BASES.map((base, i) => ({
    ...base,
    timestamp: minsAgo(MINS_AGO[i] ?? 5),
  }));
}
