"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/site/ChinarLeaf";

interface Item {
  id: string;
  year: string;
  title: string;
  text: string;
}

export function Timeline({ items, id = "history" }: { items: Item[]; id?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * Math.min(ref.current.clientWidth * 0.8, 680), behavior: "smooth" });
  if (!items.length) return null;
  return (
    <section id={id} className="relative overflow-hidden bg-saffron-50 py-20 sm:py-28" aria-labelledby={`${id}-title`}>
      <div className="container-ajk">
        <SectionHeading
          align="center"
          eyebrow="Identity & history"
          title="The story of Jammu & Kashmir"
          text="From Dogra rule to the people's uprising, the founding of the Azad Government and the promise made at the United Nations."
          action={
            <div className="flex gap-2">
              <button type="button" onClick={() => scroll(-1)} aria-label="Scroll timeline back" className="grid size-11 place-items-center rounded-full border border-pine-900/15 bg-white text-pine-800 transition hover:bg-pine-700 hover:text-white">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={() => scroll(1)} aria-label="Scroll timeline forward" className="grid size-11 place-items-center rounded-full border border-pine-900/15 bg-white text-pine-800 transition hover:bg-pine-700 hover:text-white">
                <ChevronRight className="size-5" />
              </button>
            </div>
          }
        />
      </div>
      <ol ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-4 sm:scroll-px-6 sm:px-6 xl:px-[max(1.5rem,calc((100vw-1240px)/2+1.5rem))]">
        {items.map((t, k) => (
          <li key={t.id} className="relative w-[280px] shrink-0 snap-start sm:w-[320px]">
            <div className="flex items-center gap-3">
              <span className={`size-3.5 rounded-full ring-4 ${k % 2 ? "bg-pine-700 ring-pine-700/20" : "bg-chinar ring-chinar/20"}`} />
              <span className="h-px flex-1 bg-pine-900/15" />
            </div>
            <p className="mt-5 font-display text-5xl font-semibold text-pine-800">{t.year}</p>
            <h3 className="mt-3 text-lg font-bold text-pine-900">{t.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{t.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
