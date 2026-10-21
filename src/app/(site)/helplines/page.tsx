import type { Metadata } from "next";
import { byOrder, readDB } from "@/lib/store";
import { PageHero } from "@/components/site/SiteFooter";
import { HelplineDirectory } from "@/components/site/Directories";
import { HELPLINE_CATEGORIES } from "@/lib/schema";

export const metadata: Metadata = { title: "Helplines & Emergency Numbers" };

export default async function HelplinesPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const db = await readDB();
  const cats = [...new Set([...HELPLINE_CATEGORIES, ...db.helplines.map((h) => h.category)])].filter((x) => db.helplines.some((h) => h.category === x));
  return (
    <>
      <PageHero eyebrow="Citizen services" title="Helplines & emergency numbers" text="Police, hospitals, telephone exchanges, medical colleges and social services across all ten districts." image="/images/site/page-header.jpeg" />
      <section className="container-ajk py-14">
        <HelplineDirectory helplines={byOrder(db.helplines)} categories={cats} initial={c && cats.includes(c) ? c : cats[0]} />
      </section>
    </>
  );
}
