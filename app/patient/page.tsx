import PatientForm from '@/components/patient-form/PatientForm';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PatientPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const hospitalCode = typeof params.hospital_code === 'string' ? params.hospital_code : '';

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">ลงทะเบียนผู้ป่วย</h1>
          <p className="mt-1 text-sm text-gray-500">
            กรุณากรอกข้อมูลให้ครบถ้วน ฟิลด์ที่มีเครื่องหมาย <span className="text-red-500">*</span> จำเป็นต้องกรอก
          </p>
        </header>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <PatientForm hospitalCode={hospitalCode} />
        </div>
      </div>
    </main>
  );
}
