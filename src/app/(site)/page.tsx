import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { byDateDesc, byOrder, readDB } from "@/lib/store";
import { Hero } from "@/components/home/Hero";
import { Leadership } from "@/components/home/Leadership";
import { CauseBand } from "@/components/home/CauseBand";
import { LatestNews } from "@/components/home/LatestNews";
import { Initiatives } from "@/components/home/Initiatives";
import { Glance } from "@/components/home/Glance";
import { Timeline } from "@/components/home/Timeline";
import { DepartmentsStrip, MapAndHelplines } from "@/components/home/Closing";
import { VideoGallery } from "@/components/site/VideoGallery";
import { SectionHeading } from "@/components/site/ChinarLeaf";

export default async function HomePage() {
  const db = await readDB();
  const s = db.settings;
  const published = byDateDesc(db.news.filter((n) => n.published));
  const featured = published.filter((n) => n.featured);
  const news = [...featured.slice(0, 1), ...published.filter((n) => n.id !== featured[0]?.id)].slice(0, 5);
  const featuredDepts = byOrder(db.departments).filter((d) => d.featured);
  const deptsForStrip = featuredDepts.length >= 6 ? featuredDepts : byOrder(db.departments).slice(0, 12);

  return (
    <>
      <Hero
        slides={byOrder(db.hero)}
        eyebrow={s.heroEyebrow}
        title={s.heroTitle}
        urdu={s.urduName}
        subtitle={s.heroSubtitle}
        jobsUrl={s.jobsUrl}
        tendersUrl={s.tendersUrl}
      />
      <Leadership intro={s.intro} leaders={byOrder(db.leaders)} />
      <CauseBand title={s.causeTitle} text={s.causeText} quote={s.causeQuote} quoteSource={s.causeQuoteSource} days={byOrder(db.days)} />
      <LatestNews news={news} />
      <Initiatives slides={byOrder(db.slides)} />
      <Glance sectors={byOrder(db.glance)} stats={byOrder(db.stats)} overview={s.overview} />
      <Timeline items={byOrder(db.timeline)} />
      {db.videos.length > 0 && (
        <section className="bg-white py-20 sm:py-28" aria-labelledby="videos-title">
          <div className="container-ajk">
            <SectionHeading
              align="center"
              eyebrow="Video gallery"
              title="See Azad Kashmir"
              action={
                <Link href="/videos" className="inline-flex items-center gap-2 rounded-full border border-pine-700 px-5 py-2.5 text-sm font-semibold text-pine-700 transition hover:bg-pine-700 hover:text-white">
                  All videos <ArrowRight className="size-4" />
                </Link>
              }
            />
            <VideoGallery videos={byOrder(db.videos).slice(0, 3)} />
          </div>
        </section>
      )}
      <DepartmentsStrip departments={deptsForStrip} total={db.departments.length} />
      <MapAndHelplines />
    </>
  );
}
