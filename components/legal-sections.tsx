export function LegalSections({
  sections,
}: {
  sections: Array<{ title: string; body: string }>;
}) {
  return (
    <div className="grid gap-5">
      {sections.map((section, index) => (
        <section key={section.title} className="panel p-6 md:p-8">
          <div className="mb-4 inline-flex rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-3 py-1 text-xs font-semibold text-cyanGlow">
            {String(index + 1).padStart(2, "0")}
          </div>
          <h2 className="font-heading text-3xl text-white">{section.title}</h2>
          <p className="mt-4 leading-8 text-steel">{section.body}</p>
        </section>
      ))}
    </div>
  );
}
