import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PageHero } from "@/components/site/SiteFooter";
import { Img } from "@/components/site/Img";

export const metadata: Metadata = { title: "AJ&K Map" };

const DIVISIONS = [
  ["Muzaffarabad Division", "Muzaffarabad, Neelum, Hattian Bala"],
  ["Poonch Division", "Poonch (Rawalakot), Bagh, Sudhnoti, Haveli"],
  ["Mirpur Division", "Mirpur, Kotli, Bhimber"],
];

export default function MapPage() {
  return (
    <>
      <PageHero eyebrow="About AJ&K" title="Map of Azad Jammu & Kashmir" text="Administrative map showing the ten districts of AJ&K." image="/images/site/video-3.jpg" />
      <section className="container-ajk grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr]">
        <a href="/images/site/map.jpg" target="_blank" className="group relative block aspect-[1024/1553] overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-line">
          <Img src="/images/site/map.jpg" alt="Administrative map of Azad Jammu & Kashmir" fill sizes="(min-width:1024px) 700px, 100vw" className="object-contain" />
          <span className="absolute bottom-4 right-4 rounded-full bg-pine-900/90 px-4 py-2 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">Open full size</span>
        </a>
        <div>
          <h2 className="font-display text-3xl font-semibold text-pine-900">Divisions and districts</h2>
          <ul className="mt-6 space-y-4">
            {DIVISIONS.map(([d, list]) => (
              <li key={d} className="rounded-2xl border border-line bg-white p-5">
                <p className="font-semibold text-pine-900">{d}</p>
                <p className="mt-1 text-muted">{list}</p>
              </li>
            ))}
          </ul>
          <a href="/images/site/map.jpg" download className="mt-8 inline-flex items-center gap-2 rounded-full bg-pine-700 px-6 py-3 font-semibold text-white hover:bg-pine-800">
            <Download className="size-4" /> Download map
          </a>
        </div>
      </section>
    </>
  );
}
