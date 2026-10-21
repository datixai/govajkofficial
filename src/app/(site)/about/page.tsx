import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { byOrder, readDB } from "@/lib/store";
import { PageHero } from "@/components/site/SiteFooter";
import { Glance } from "@/components/home/Glance";
import { Timeline } from "@/components/home/Timeline";
import { Img } from "@/components/site/Img";

export const metadata: Metadata = { title: "About AJ&K" };

export default async function AboutPage() {
  const db = await readDB();
  const s = db.settings;
  return (
    <>
      <PageHero eyebrow="About AJ&K" title="Azad Jammu & Kashmir" text={s.intro} image="/images/site/video-2.jpg" />
      <section className="py-20">
        <div className="container-ajk grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold text-pine-900">Overview</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">{s.overview}</p>
            <h2 className="mt-12 font-display text-3xl font-semibold text-pine-900">{s.causeTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">{s.causeText}</p>
            <Link href="/kashmir-cause" className="mt-6 inline-flex items-center gap-2 font-semibold text-chinar hover:underline">
              The Kashmir Cause <ArrowRight className="size-4" />
            </Link>
          </div>
          <aside className="space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-white ring-1 ring-line">
              <Img src="/images/site/seal.png" alt="State seal of Azad Jammu & Kashmir" fill sizes="400px" className="object-contain p-10" />
            </div>
            <p className="text-sm leading-relaxed text-muted">
              The state seal brings together the crescent and star, the chinar leaf and the mountains of Kashmir: the faith, identity and land of its people.
            </p>
          </aside>
        </div>
      </section>
      <Glance sectors={byOrder(db.glance)} stats={byOrder(db.stats)} overview="" />
      <Timeline items={byOrder(db.timeline)} />
      <section id="days" className="py-20">
        <div className="container-ajk">
          <h2 className="font-display text-3xl font-semibold text-pine-900">Days of remembrance</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {byOrder(db.days).map((d) => (
              <li key={d.id} className="rounded-2xl border border-line bg-white p-6">
                <p className="text-sm font-bold text-chinar">{d.date}</p>
                <p className="mt-2 font-display text-xl font-semibold text-pine-900">{d.title}</p>
                <p className="mt-2 text-muted">{d.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
