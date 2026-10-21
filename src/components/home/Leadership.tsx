import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Leader } from "@/lib/types";
import { Img } from "@/components/site/Img";
import { ChinarLeaf } from "@/components/site/ChinarLeaf";

export function Leadership({ intro, leaders }: { intro: string; leaders: Leader[] }) {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="leadership-title">
      <div className="container-ajk">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow flex items-center justify-center gap-2 text-chinar">
            <ChinarLeaf className="size-4" veins={false} /> The State
          </p>
          <h2 id="leadership-title" className="mt-3 font-display text-3xl font-semibold leading-tight text-pine-900 sm:text-4xl">
            A self-governing state with its own institutions
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{intro}</p>
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-5 rounded-2xl border border-line bg-white p-5 text-left">
            <Image src="/images/site/seal.png" alt="State seal of Azad Jammu & Kashmir" width={72} height={72} className="shrink-0" />
            <p className="text-sm leading-relaxed text-muted">
              The seal shows the crescent and star, the chinar leaf and the mountains of Kashmir: faith, identity and the land.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
          {leaders.map((l) => (
            <article key={l.id} className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-line transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/4.4] overflow-hidden bg-pine-100">
                <Img src={l.image} alt={`${l.name}, ${l.role}`} fill sizes="(min-width:1024px) 380px, (min-width:640px) 50vw, 100vw" className="object-cover object-top transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-pine-950/90 to-transparent p-5 pt-16 text-white">
                  <p className="eyebrow text-saffron">{l.role}</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">{l.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[0.95rem] leading-relaxed text-muted">{l.bio}</p>
                {l.link && (
                  <a href={l.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-pine-700 hover:text-chinar">
                    Official website <ArrowUpRight className="size-4" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
