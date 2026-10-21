import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { byOrder, readDB } from "@/lib/store";
import { RichText } from "@/lib/markdown";
import { PageHero } from "@/components/site/SiteFooter";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = (await readDB()).pages.find((p) => p.slug === slug);
  return page ? { title: page.title, description: page.subtitle } : {};
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const db = await readDB();
  const page = db.pages.find((p) => p.slug === slug);
  if (!page) notFound();
  const isCause = slug === "kashmir-cause";
  const headings = page.body
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => l.slice(3));

  return (
    <>
      <PageHero eyebrow={isCause ? "Identity and struggle" : "Government of AJ&K"} title={page.title} text={page.subtitle} image={page.heroImage} />
      <div className="container-ajk grid gap-12 py-16 lg:grid-cols-[260px_1fr] lg:py-20">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          {headings.length > 1 && (
            <nav aria-label="On this page" className="rounded-2xl border border-line bg-white p-5">
              <p className="eyebrow text-chinar">On this page</p>
              <ol className="mt-3 space-y-2 text-sm">
                {headings.map((h) => (
                  <li key={h} className="text-pine-900">
                    {h}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {isCause && (
            <div className="mt-5 rounded-2xl bg-pine-900 p-5 text-sm text-white">
              <p className="eyebrow text-saffron">Key dates</p>
              <ul className="mt-3 space-y-2.5">
                {byOrder(db.timeline)
                  .filter((t) => Number(t.year) >= 1947 && Number(t.year) <= 1972)
                  .map((t) => (
                    <li key={t.id}>
                      <span className="font-bold text-saffron">{t.year}</span> {t.title}
                    </li>
                  ))}
              </ul>
              <Link href="/about#history" className="mt-4 inline-block font-semibold text-white underline-offset-4 hover:underline">
                Full timeline
              </Link>
            </div>
          )}
        </aside>
        <article className="max-w-3xl">
          <RichText text={page.body} />
          {page.source && (
            <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
              Source: <span className="font-semibold text-pine-900">{page.source}</span>
            </p>
          )}
        </article>
      </div>
    </>
  );
}
