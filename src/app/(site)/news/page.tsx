import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { byDateDesc, readDB } from "@/lib/store";
import { PageHero } from "@/components/site/SiteFooter";
import { NewsCard } from "@/components/home/LatestNews";

export const metadata: Metadata = { title: "News & Updates" };

const PER_PAGE = 12;

type Props = { searchParams: Promise<{ page?: string; q?: string; year?: string }> };

export default async function NewsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();
  const year = sp.year ?? "";
  const db = await readDB();
  const all = byDateDesc(db.news.filter((n) => n.published));
  const years = [...new Set(all.map((n) => n.date.slice(0, 4)))];
  const filtered = all.filter((n) => (!year || n.date.startsWith(year)) && (!q || `${n.title} ${n.body}`.toLowerCase().includes(q)));
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(sp.page) || 1));
  const items = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const href = (p: number, y = year) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (y) params.set("year", y);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/news${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHero eyebrow="Media" title="News & Updates" text="Official news and press releases of the Azad Government of the State of Jammu & Kashmir." image="/images/site/page-header.jpeg" />
      <section className="py-14">
        <div className="container-ajk">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form action="/news" className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input name="q" defaultValue={sp.q} placeholder="Search news" aria-label="Search news" className="h-12 w-full rounded-full border border-line bg-white pl-11 pr-4 outline-none focus:border-pine-500" />
              {year && <input type="hidden" name="year" value={year} />}
            </form>
            <div className="flex flex-wrap gap-2">
              <Link href={href(1, "")} className={`rounded-full px-4 py-2 text-sm font-semibold ${!year ? "bg-pine-700 text-white" : "bg-white text-pine-800 ring-1 ring-line hover:ring-pine-500"}`}>
                All years
              </Link>
              {years.map((y) => (
                <Link key={y} href={href(1, y)} className={`rounded-full px-4 py-2 text-sm font-semibold ${year === y ? "bg-pine-700 text-white" : "bg-white text-pine-800 ring-1 ring-line hover:ring-pine-500"}`}>
                  {y}
                </Link>
              ))}
            </div>
          </div>
          <p className="mt-6 text-sm text-muted">
            {filtered.length} {filtered.length === 1 ? "story" : "stories"}
            {q && ` matching "${sp.q}"`}
          </p>
          {items.length ? (
            <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((n) => (
                <li key={n.id}>
                  <NewsCard n={n} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-10 rounded-2xl bg-white p-10 text-center text-muted ring-1 ring-line">No news found. Try another search.</p>
          )}
          {pages > 1 && (
            <nav aria-label="Pagination" className="mt-14 flex flex-wrap justify-center gap-2">
              {Array.from({ length: pages }, (_, k) => k + 1).map((p) => (
                <Link key={p} href={href(p)} aria-current={p === page ? "page" : undefined} className={`grid size-11 place-items-center rounded-full text-sm font-semibold ${p === page ? "bg-pine-700 text-white" : "bg-white text-pine-800 ring-1 ring-line hover:ring-pine-500"}`}>
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
