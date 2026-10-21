import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { byDateDesc, readDB } from "@/lib/store";
import { excerpt, formatDate } from "@/lib/markdown";
import { PageHero } from "@/components/site/SiteFooter";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const term = q.trim().toLowerCase();
  const db = await readDB();
  const has = (s: string) => s.toLowerCase().includes(term);
  const news = term ? byDateDesc(db.news.filter((n) => n.published && has(`${n.title} ${n.body}`))).slice(0, 20) : [];
  const pages = term ? db.pages.filter((p) => has(`${p.title} ${p.body}`)) : [];
  const depts = term ? db.departments.filter((d) => has(`${d.name} ${d.category}`)) : [];
  const helps = term ? db.helplines.filter((h) => has(`${h.group} ${h.designation} ${h.number}`)).slice(0, 20) : [];
  const total = news.length + pages.length + depts.length + helps.length;

  return (
    <>
      <PageHero eyebrow="Search" title="Search the portal" />
      <section className="container-ajk py-12">
        <form action="/search" className="relative max-w-2xl">
          <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={q} autoFocus placeholder="News, departments, helplines..." aria-label="Search" className="h-14 w-full rounded-full border border-line bg-white pl-14 pr-32 text-lg outline-none focus:border-pine-500" />
          <button className="absolute right-2 top-2 h-10 rounded-full bg-pine-700 px-6 font-semibold text-white hover:bg-pine-800">Search</button>
        </form>
        {term && (
          <p className="mt-6 text-muted">
            {total} result{total === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
          </p>
        )}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {pages.map((p) => (
              <Link key={p.id} href={`/${p.slug}`} className="block rounded-2xl border border-line bg-white p-5 hover:border-pine-500">
                <p className="eyebrow text-chinar">Page</p>
                <p className="mt-1 text-lg font-semibold text-pine-900">{p.title}</p>
                <p className="mt-1 text-sm text-muted">{excerpt(p.body, 200)}</p>
              </Link>
            ))}
            {news.map((n) => (
              <Link key={n.id} href={`/news/${n.slug}`} className="block rounded-2xl border border-line bg-white p-5 hover:border-pine-500">
                <p className="eyebrow text-chinar">News, {formatDate(n.date)}</p>
                <p className="mt-1 font-semibold text-pine-900">{n.title}</p>
              </Link>
            ))}
          </div>
          <div className="space-y-6">
            {depts.length > 0 && (
              <div className="rounded-2xl border border-line bg-white p-5">
                <p className="eyebrow text-chinar">Departments</p>
                <ul className="mt-3 space-y-2">
                  {depts.map((d) => (
                    <li key={d.id}>
                      <a href={d.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 text-pine-900 hover:text-chinar">
                        {d.name} <ArrowUpRight className="size-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {helps.length > 0 && (
              <div className="rounded-2xl border border-line bg-white p-5">
                <p className="eyebrow text-chinar">Helplines</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {helps.map((h) => (
                    <li key={h.id} className="flex justify-between gap-3">
                      <span className="text-pine-900">
                        {h.designation}, <span className="text-muted">{h.group}</span>
                      </span>
                      <span className="shrink-0 font-mono">{h.number || "-"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
