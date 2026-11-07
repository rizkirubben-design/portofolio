export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="inline-flex items-center gap-2">
        <span className="text-accent text-xs">✦</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary font-sans">
          {eyebrow}
        </span>
        <span className="text-accent text-xs">✦</span>
      </div>
      <h2 className="font-heading text-3xl font-normal tracking-tight text-balance sm:text-4xl text-foreground">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
