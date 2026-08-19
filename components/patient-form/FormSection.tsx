type FormSectionProps = {
  number: number;
  title: string;
  children: React.ReactNode;
};

export default function FormSection({ number, title, children }: FormSectionProps) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {number}
        </span>
        <h2 className="font-semibold text-slate-800">{title}</h2>
        <div className="flex-1 border-t border-slate-100" />
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
