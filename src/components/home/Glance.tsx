"use client";

import { useState } from "react";
import { Cpu, GraduationCap, Mountain, Zap, Layers } from "lucide-react";
import { Img } from "@/components/site/Img";
import { SectionHeading } from "@/components/site/ChinarLeaf";

interface Sector {
  id: string;
  title: string;
  text: string;
  image: string;
  accent: string;
}
interface Stat {
  id: string;
  value: string;
  unit: string;
  label: string;
  note: string;
}

const ACCENT: Record<string, string> = {
  teal: "#0f766e",
  violet: "#6d28d9",
  gold: "#b7791f",
  red: "#c8431a",
  green: "#0f5a36",
};

function iconFor(title: string) {
  const t = title.toLowerCase();
  if (t.includes("touris")) return Mountain;
  if (t.includes("tech") || t.includes("it")) return Cpu;
  if (t.includes("educa")) return GraduationCap;
  if (t.includes("power") || t.includes("hydro") || t.includes("energy")) return Zap;
  return Layers;
}

export function Glance({ sectors, stats, overview }: { sectors: Sector[]; stats: Stat[]; overview: string }) {
  const [i, setI] = useState(0);
  const s = sectors[i];
  return (
    <section className="bg-white py-20 sm:py-28" aria-labelledby="glance-title">
      <div className="container-ajk">
        <SectionHeading align="center" eyebrow="Kashmir at a glance" title="Land, people and potential" text={overview} />

        {stats.length > 0 && (
          <dl className="mb-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((st) => (
              <div key={st.id} className="rounded-3xl border border-line bg-paper p-6">
                <dt className="text-sm font-semibold text-muted">{st.label}</dt>
                <dd className="mt-2 font-display text-4xl font-semibold text-pine-800">
                  {st.value}
                  {st.unit && <span className="ml-1.5 font-sans text-base font-medium text-muted">{st.unit}</span>}
                </dd>
                {st.note && <dd className="mt-2 text-xs leading-relaxed text-muted">{st.note}</dd>}
              </div>
            ))}
          </dl>
        )}

        {s && (
          <div className="grid overflow-hidden rounded-3xl bg-pine-950 text-white lg:grid-cols-2">
            <div className="relative min-h-[300px] lg:min-h-[480px]">
              {sectors.map((x, k) => (
                <div key={x.id} className={`absolute inset-0 transition-opacity duration-700 ${k === i ? "opacity-100" : "opacity-0"}`}>
                  <Img src={x.image} alt={x.title} fill sizes="(min-width:1024px) 620px, 100vw" className="object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col p-7 sm:p-10">
              <div role="tablist" aria-label="Sectors" className="flex flex-wrap gap-2">
                {sectors.map((x, k) => {
                  const Icon = iconFor(x.title);
                  return (
                    <button
                      key={x.id}
                      role="tab"
                      type="button"
                      aria-selected={k === i}
                      onClick={() => setI(k)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${k === i ? "bg-white text-pine-950" : "bg-white/10 text-white/80 hover:bg-white/20"}`}
                    >
                      <Icon className="size-4" style={{ color: k === i ? ACCENT[x.accent] ?? ACCENT.green : undefined }} />
                      {x.title}
                    </button>
                  );
                })}
              </div>
              <div role="tabpanel" key={s.id} className="mt-10 animate-rise">
                <span className="block h-1 w-14 rounded-full" style={{ background: ACCENT[s.accent] ?? ACCENT.green }} />
                <h3 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">{s.title}</h3>
                <p className="mt-5 text-lg leading-relaxed text-white/80">{s.text}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
