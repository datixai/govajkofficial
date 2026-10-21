import type { Metadata } from "next";
import { byOrder, readDB } from "@/lib/store";
import { PageHero } from "@/components/site/SiteFooter";
import { VideoGallery } from "@/components/site/VideoGallery";

export const metadata: Metadata = { title: "Videos" };

export default async function VideosPage() {
  const db = await readDB();
  return (
    <>
      <PageHero eyebrow="Media" title="Video gallery" text="Videos about Azad Jammu & Kashmir: its people, places and progress." image="/images/site/hero-sharda.jpg" />
      <section className="container-ajk py-16">
        {db.videos.length ? <VideoGallery videos={byOrder(db.videos)} /> : <p className="text-muted">No videos yet.</p>}
      </section>
    </>
  );
}
