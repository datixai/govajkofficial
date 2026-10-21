export function ChinarLeaf({ className, veins = true }: { className?: string; veins?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M32 2l4.6 10.4 6.9-4.4-1.6 12.6 10.6-6.2-2.6 11 12.1-1.3-8.8 10.3 4.4 3.9-13.3 2.8 2.1 7.2-11.3-3.6-1.9 9.3h-2.4l-1.9-9.3-11.3 3.6 2.1-7.2-13.3-2.8 4.4-3.9L2 24.1l12.1 1.3-2.6-11 10.6 6.2-1.6-12.6 6.9 4.4z"
      />
      {veins && (
        <path
          fill="none"
          stroke="rgba(0,0,0,.28)"
          strokeWidth="1.6"
          strokeLinecap="round"
          d="M32 61V20M32 41L14 27M32 41l18-14M32 33L22 15M32 33l10-18"
        />
      )}
    </svg>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  tone = "light",
  align = "left",
  action,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  action?: React.ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div className={`mb-10 flex flex-col gap-5 md:mb-12 ${align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={align === "center" ? "max-w-3xl" : "max-w-2xl"}>
        <p className={`eyebrow flex items-center gap-2 ${align === "center" ? "justify-center" : ""} ${dark ? "text-saffron" : "text-chinar"}`}>
          <ChinarLeaf className="size-4" veins={false} />
          {eyebrow}
        </p>
        <h2 className={`mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl ${dark ? "text-white" : "text-pine-900"}`}>
          {title}
        </h2>
        {text && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? "text-white/75" : "text-muted"}`}>{text}</p>}
      </div>
      {action}
    </div>
  );
}
