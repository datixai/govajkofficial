"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Img } from "@/components/site/Img";
import { SectionHeading } from "@/components/site/ChinarLeaf";

interface Slide {
  id: string;
  title: string;
  image: string;
  link: string;
}

export function Initiatives({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const paused = useRef(false);
  const n = slides.length;
  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => !paused.current && setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);
  if (!n) return null;
  const go = (d: number) => setI((x) => (x + d + n) % n);

  return (
    <section className="py-20 sm:py-28" aria-labelledby="init-title" aria-roledescription="carousel">
      <div className="container-ajk">
        <SectionHeading
          align="center"
          eyebrow="Initiatives & campaigns"
          title="Public services and national campaigns"
          action={
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Previous banner" className="grid size-11 place-items-center rounded-full border border-line bg-white text-pine-800 transition hover:border-pine-700 hover:bg-pine-700 hover:text-white">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next banner" className="grid size-11 place-items-center rounded-full border border-line bg-white text-pine-800 transition hover:border-pine-700 hover:bg-pine-700 hover:text-white">
                <ChevronRight className="size-5" />
              </button>
            </div>
          }
        />
        <div
          className="relative overflow-hidden rounded-3xl bg-pine-900 shadow-xl ring-1 ring-black/5"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          <div className="flex transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)]" style={{ transform: `translateX(-${i * 100}%)` }}>
            {slides.map((s, k) => {
              const inner = (
                <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[2.4/1]">
                  {/* blurred copy fills the frame so banners of any shape show in full */}
                  <Img src={s.image} alt="" fill sizes="(min-width:1240px) 1200px, 100vw" className="scale-110 object-cover opacity-60 blur-2xl" aria-hidden="true" />
                  <Img src={s.image} alt={s.title} fill sizes="(min-width:1240px) 1200px, 100vw" className="object-contain" />
                </div>
              );
              const ext = /^https?:/.test(s.link);
              return (
                <div key={s.id} className="w-full shrink-0" aria-hidden={k !== i} role="group" aria-label={`${k + 1} of ${n}: ${s.title}`}>
                  {s.link ? (
                    ext ? (
                      <a href={s.link} target="_blank" rel="noopener noreferrer" tabIndex={k === i ? 0 : -1}>
                        {inner}
                      </a>
                    ) : (
                      <Link href={s.link} tabIndex={k === i ? 0 : -1}>
                        {inner}
                      </Link>
                    )
                  ) : (
                    inner
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-medium text-pine-900">{slides[i].title}</p>
          <div className="flex gap-1.5">
            {slides.map((s, k) => (
              <button key={s.id} type="button" aria-label={`Show banner ${k + 1}`} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-chinar" : "w-3 bg-pine-900/20 hover:bg-pine-900/40"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
