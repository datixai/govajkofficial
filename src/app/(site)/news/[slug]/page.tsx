import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { byDateDesc, readDB } from "@/lib/store";
import { excerpt, formatDate, RichText } from "@/lib/markdown";
import { Img } from "@/components/site/Img";
import { NewsCard } from "@/components/home/LatestNews";
import { ShareButtons } from "@/components/site/ShareButtons";

type Props = { params: Promise<{ slug: string }> };

// Pre-build every published story so it opens instantly from the cache.
export async function generateStaticParams() {
  return (await readDB()).news.filter((n) => n.published).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = (await readDB()).news.find((x) => x.slug === slug && x.published);
  return n ? { title: n.title, description: excerpt(n.body, 160), openGraph: { images: n.image ? [n.image] : [] } } : {};
}

export default async function NewsArticle({ params }: Props) {
  const { slug } = await params;
  const db = await readDB();
  const n = db.news.find((x) => x.slug === slug && x.published);
  if (!n) notFound();
  const more = byDateDesc(db.news.filter((x) => x.published && x.id !== n.id)).slice(0, 3);

  return (
    <>
      <section className="bg-pine-900 pb-14 pt-36 text-white sm:pt-44">
        <div className="container-ajk max-w-4xl">
          <Link href="/news" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="size-4" /> All news
          </Link>
          <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-saffron">
            <Calendar className="size-4" /> {formatDate(n.date)}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-[2.6rem]">{n.title}</h1>
        </div>
      </section>
      <article className="container-ajk max-w-4xl py-12">
        {n.image && (
          <div className="relative -mt-4 mb-10 aspect-[16/9] overflow-hidden rounded-3xl bg-pine-100 shadow-xl">
            <Img src={n.image} alt="" fill priority sizes="(min-width:1024px) 900px, 100vw" className="object-cover" />
          </div>
        )}
        <RichText text={n.body} />
        <div className="mt-12 border-t border-line pt-6">
          <ShareButtons title={n.title} />
        </div>
      </article>
      {more.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-ajk">
            <h2 className="font-display text-2xl font-semibold text-pine-900">More news</h2>
            <ul className="mt-8 grid gap-8 sm:grid-cols-3">
              {more.map((m) => (
                <li key={m.id}>
                  <NewsCard n={m} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
