import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import type { NewsItem } from "@/lib/types";
import { excerpt, formatDate } from "@/lib/markdown";
import { Fallback, Img } from "@/components/site/Img";
import { SectionHeading } from "@/components/site/ChinarLeaf";

export function NewsCard({ n, compact = false }: { n: NewsItem; compact?: boolean }) {
  return (
    <Link href={`/news/${n.slug}`} className={`group flex gap-4 ${compact ? "items-center" : "flex-col"}`}>
      <div className={`relative shrink-0 overflow-hidden rounded-2xl bg-pine-100 ${compact ? "size-24 sm:h-24 sm:w-32" : "aspect-[16/10] w-full"}`}>
        {n.image ? (
          <Img src={n.image} alt="" fill sizes={compact ? "128px" : "(min-width:1024px) 400px, 100vw"} className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <Fallback className="absolute inset-0" />
        )}
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-chinar">
          <Calendar className="size-3.5" /> {formatDate(n.date)}
        </p>
        <h3 className={`mt-1.5 font-semibold leading-snug text-pine-900 group-hover:text-pine-600 ${compact ? "line-clamp-3 text-[0.95rem]" : "line-clamp-3 text-lg"}`}>{n.title}</h3>
      </div>
    </Link>
  );
}

export function LatestNews({ news }: { news: NewsItem[] }) {
  const [lead, ...rest] = news;
  if (!lead) return null;
  return (
    <section className="bg-white py-20 sm:py-28" aria-labelledby="news-title">
      <div className="container-ajk">
        <SectionHeading
          align="center"
          eyebrow="News & updates"
          title="From the Government of AJK"
          action={
            <Link href="/news" className="inline-flex items-center gap-2 rounded-full border border-pine-700 px-5 py-2.5 text-sm font-semibold text-pine-700 transition hover:bg-pine-700 hover:text-white">
              All news <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
          <Link href={`/news/${lead.slug}`} className="group relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl bg-pine-900 p-7 text-white sm:p-10">
            {lead.image ? (
              <Img src={lead.image} alt="" fill sizes="(min-width:1024px) 700px, 100vw" className="-z-20 object-cover transition duration-700 group-hover:scale-105" />
            ) : (
              <Fallback className="absolute inset-0 -z-20" />
            )}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-pine-950 via-pine-950/60 to-transparent" />
            <span className="eyebrow w-fit rounded-full bg-saffron px-3 py-1 text-pine-950">Latest</span>
            <p className="mt-4 text-sm text-white/75">{formatDate(lead.date)}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold leading-snug sm:text-3xl">{lead.title}</h3>
            <p className="mt-3 line-clamp-2 max-w-xl text-white/75">{excerpt(lead.body, 200)}</p>
          </Link>
          <ul className="flex flex-col divide-y divide-line">
            {rest.slice(0, 4).map((n) => (
              <li key={n.id} className="py-4 first:pt-0 last:pb-0">
                <NewsCard n={n} compact />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
