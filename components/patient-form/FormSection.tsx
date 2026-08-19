type FormSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800">
        {title}
      </h2>
      {children}
    </section>
  );
}
