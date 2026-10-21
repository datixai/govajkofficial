import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import type { DayItem } from "@/lib/types";
import { ChinarLeaf } from "@/components/site/ChinarLeaf";

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

function nextDayIndex(days: DayItem[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  let best = -1;
  let bestDiff = Infinity;
  days.forEach((d, i) => {
    const m = d.date.trim().match(/^(\d{1,2})\s+([a-z]+)/i);
    if (!m) return;
    const month = MONTHS.indexOf(m[2].toLowerCase());
    if (month < 0) return;
    let t = new Date(now.getFullYear(), month, Number(m[1])).getTime();
    if (t < today) t = new Date(now.getFullYear() + 1, month, Number(m[1])).getTime();
    if (t - today < bestDiff) {
      bestDiff = t - today;
      best = i;
    }
  });
  return best;
}

export function CauseBand({
  title,
  text,
  quote,
  quoteSource,
  days,
}: {
  title: string;
  text: string;
  quote: string;
  quoteSource: string;
  days: DayItem[];
}) {
  const years = new Date().getFullYear() - 1948;
  const next = nextDayIndex(days);
  const facts = [
    [`${years}`, "years on the UN Security Council agenda"],
    ["1948", "UNSC Resolution 47 promises a plebiscite"],
    ["1947", "AJK liberated by its own people on 24 October"],
  ];
  return (
    <section className="relative isolate overflow-hidden bg-pine-900 py-20 text-white sm:py-28" aria-labelledby="cause-title">
      <div className="bg-chinar-pattern absolute inset-0 -z-10 opacity-[0.04]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(200,67,26,.35),transparent_55%)]" />
      <div className="container-ajk">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-12 text-center">
          <div className="max-w-3xl">
            <p className="eyebrow flex items-center justify-center gap-2 text-saffron">
              <ChinarLeaf className="size-4" veins={false} /> Identity and struggle
            </p>
            <h2 id="cause-title" className="mt-3 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl">
              {title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/80">{text}</p>
            <Link href="/kashmir-cause" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-pine-900 transition hover:bg-saffron">
              Read the history of the dispute <ArrowRight className="size-4" />
            </Link>
          </div>
          <figure className="relative w-full rounded-3xl border border-white/15 bg-white/[0.04] p-8 backdrop-blur sm:p-10">
            <Quote className="mx-auto size-10 text-saffron" aria-hidden="true" />
            <blockquote className="mt-4 font-display text-2xl leading-snug sm:text-[1.9rem]">&ldquo;{quote}&rdquo;</blockquote>
            <figcaption className="mt-6 flex items-center justify-center gap-3 text-sm text-white/70">
              <span className="h-px w-8 bg-saffron" /> {quoteSource}
            </figcaption>
          </figure>
        </div>

        <dl className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-3">
          {facts.map(([v, l]) => (
            <div key={l} className="bg-pine-900 p-7 text-center">
              <dt className="sr-only">{l}</dt>
              <dd className="font-display text-5xl font-semibold text-saffron">{v}</dd>
              <dd className="mt-2 text-sm text-white/75">{l}</dd>
            </div>
          ))}
        </dl>

        {days.length > 0 && (
          <div id="days" className="mt-16">
            <h3 className="eyebrow text-center text-white/60">Days of remembrance</h3>
            <ul className="no-scrollbar mt-5 flex snap-x gap-4 overflow-x-auto pb-2">
              {days.map((d, i) => (
                <li key={d.id} className={`min-w-[240px] flex-1 snap-start rounded-2xl border p-5 ${i === next ? "border-saffron bg-saffron/10" : "border-white/10 bg-white/[0.03]"}`}>
                  <p className={`text-sm font-bold ${i === next ? "text-saffron" : "text-white/60"}`}>
                    {d.date}
                    {i === next && <span className="ml-2 rounded-full bg-saffron px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-pine-950">Next</span>}
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold">{d.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/65">{d.text}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
