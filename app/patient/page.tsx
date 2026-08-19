import PatientForm from '@/components/patient-form/PatientForm';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PatientPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const hospitalCode = typeof params.hospital_code === 'string' ? params.hospital_code : '';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1">
            <svg
              className="h-3.5 w-3.5 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              <circle cx="12" cy="12" r="10" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-semibold text-blue-700">Agnos Health</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patient Registration</h1>
          <p className="mt-2 text-slate-500">
            Please fill in all required fields. Fields marked with{' '}
            <span className="font-medium text-red-500">*</span> are required.
          </p>
        </header>

        <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/5 sm:p-10">
          <PatientForm hospitalCode={hospitalCode} />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Your information is protected and stored securely.
        </p>
      </div>
    </main>
  );
}
