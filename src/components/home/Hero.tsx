"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, Building2, FileText, Newspaper, Phone, ScrollText } from "lucide-react";
import { Img } from "@/components/site/Img";
import { ChinarLeaf } from "@/components/site/ChinarLeaf";

interface Props {
  slides: { id: string; title: string; image: string }[];
  eyebrow: string;
  title: string;
  urdu: string;
  subtitle: string;
  jobsUrl: string;
  tendersUrl: string;
}

export function Hero({ slides, eyebrow, title, urdu, subtitle, jobsUrl, tendersUrl }: Props) {
  const [i, setI] = useState(0);
  // Load each photo only when it is about to be shown, not all at once.
  const [shown, setShown] = useState<Set<number>>(() => new Set([0, 1]));
  useEffect(() => {
    setShown((s) => (s.has(i) && s.has((i + 1) % slides.length) ? s : new Set([...s, i, (i + 1) % slides.length])));
  }, [i, slides.length]);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides.length]);

  const quick = [
    { label: "Departments", text: "Directory of all offices", href: "/departments", icon: Building2 },
    { label: "Helplines", text: "Police, hospitals, rescue", href: "/helplines", icon: Phone },
    { label: "Jobs", text: "Current vacancies", href: jobsUrl, icon: Briefcase },
    { label: "Tenders", text: "Procurement notices", href: tendersUrl, icon: FileText },
    { label: "News", text: "Official updates", href: "/news", icon: Newspaper },
    { label: "Kashmir Cause", text: "History and UN resolutions", href: "/kashmir-cause", icon: ScrollText },
  ];

  return (
    <section className="relative isolate">
      <div className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-pine-950 pb-40 pt-40 sm:min-h-[760px] lg:min-h-[94vh] lg:pb-48">
        {slides.map((s, n) => shown.has(n) && (
          <div key={s.id} className={`absolute inset-0 -z-20 transition-opacity duration-[1600ms] ${n === i ? "opacity-100" : "opacity-0"}`} aria-hidden={n !== i}>
            <Img src={s.image} alt="" fill priority={n === 0} quality={70} sizes="100vw" className={`object-cover ${n === i ? "animate-kenburns" : ""}`} />
          </div>
        ))}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_48%,rgba(5,34,21,.62)_0%,rgba(5,34,21,.28)_70%,rgba(5,34,21,.12)_100%),linear-gradient(0deg,rgba(5,34,21,.92)_0%,transparent_38%),linear-gradient(180deg,rgba(0,0,0,.45)_0%,transparent_22%)]" />
        <ChinarLeaf className="absolute -left-20 top-28 -z-10 size-80 -rotate-12 text-chinar/20" veins={false} />

        <div className="container-ajk">
          <div className="mx-auto max-w-4xl text-center text-white [text-shadow:0_2px_24px_rgba(0,0,0,.45)]">
            <p className="eyebrow flex items-center justify-center gap-3 text-saffron animate-rise">
              <span className="h-px w-8 bg-saffron" /> {eyebrow} <span className="h-px w-8 bg-saffron" />
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight animate-rise [animation-delay:.1s] sm:text-7xl lg:text-[5.5rem]">
              {title}
            </h1>
            <p className="mt-4 font-urdu text-2xl leading-[2] text-saffron/90 animate-rise [animation-delay:.2s] sm:text-3xl" lang="ur" dir="rtl">
              {urdu}
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-white/85 animate-rise [animation-delay:.3s] sm:text-xl">{subtitle}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 animate-rise [animation-delay:.4s]">
              <Link href="/kashmir-cause" className="inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-3.5 font-semibold text-pine-950 shadow-lg shadow-black/20 transition hover:bg-[#ffb92e]">
                The Kashmir Cause <ArrowRight className="size-4" />
              </Link>
              <Link href="/about" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10">
                Discover AJK
              </Link>
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-40 right-4 hidden items-center gap-3 text-xs text-white/70 sm:right-6 md:flex lg:bottom-48">
            <span>{slides[i]?.title}</span>
            <div className="flex gap-1.5">
              {slides.map((s, n) => (
                <button key={s.id} type="button" aria-label={`Show photo ${n + 1}: ${s.title}`} onClick={() => setI(n)} className={`h-1.5 rounded-full transition-all ${n === i ? "w-8 bg-saffron" : "w-3 bg-white/40 hover:bg-white/70"}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* quick access */}
      <div className="container-ajk relative -mt-28 lg:-mt-32">
        <nav aria-label="Quick access" className="grid grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-20px_rgba(5,34,21,.35)] ring-1 ring-black/5 sm:grid-cols-3 lg:grid-cols-6">
          {quick.map(({ label, text, href, icon: Icon }) => {
            const external = /^https?:/.test(href);
            const cls = "group flex flex-col gap-3 border-b border-r border-line p-5 transition-colors hover:bg-pine-50 sm:p-6";
            const inner = (
              <>
                <span className="grid size-11 place-items-center rounded-2xl bg-pine-50 text-pine-700 transition-colors group-hover:bg-pine-700 group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold text-pine-900">{label}</span>
                  <span className="mt-0.5 block text-xs text-muted">{text}</span>
                </span>
              </>
            );
            return external ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <Link key={label} href={href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
