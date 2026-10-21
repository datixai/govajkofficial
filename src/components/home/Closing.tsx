import Link from "next/link";
import { ArrowRight, Map, Phone, Siren } from "lucide-react";
import type { Department } from "@/lib/types";
import { Img } from "@/components/site/Img";
import { SectionHeading } from "@/components/site/ChinarLeaf";

function initials(name: string) {
  return name
    .replace(/&/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 || /^[A-Z]{2,}$/.test(w))
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function DepartmentsStrip({ departments, total }: { departments: Department[]; total: number }) {
  const row = [...departments, ...departments];
  return (
    <section className="py-20 sm:py-28" aria-labelledby="dept-title">
      <div className="container-ajk">
        <SectionHeading
          align="center"
          eyebrow="Departments"
          title={`${total} departments, courts and services`}
          text="Find any office of the Government of AJK and go straight to its website."
          action={
            <Link href="/departments" className="inline-flex items-center gap-2 rounded-full bg-pine-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pine-800">
              Department directory <ArrowRight className="size-4" />
            </Link>
          }
        />
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <ul className="animate-marquee flex w-max gap-5">
          {row.map((d, k) => (
            <li key={`${d.id}-${k}`} aria-hidden={k >= departments.length}>
              <a href={d.url} target="_blank" rel="noopener noreferrer" tabIndex={k >= departments.length ? -1 : 0} className="flex w-56 items-center gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-pine-500 hover:shadow-lg">
                <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-pine-50 font-display font-semibold text-pine-700">
                  {d.logo ? <Img src={d.logo} alt="" fill sizes="56px" className="object-contain p-1" /> : initials(d.name)}
                </span>
                <span className="text-sm font-semibold leading-snug text-pine-900">{d.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function MapAndHelplines() {
  return (
    <section className="pb-20 sm:pb-28">
      <div className="container-ajk grid gap-6 lg:grid-cols-2">
        <Link href="/ajk-map" className="group relative isolate flex min-h-[320px] overflow-hidden rounded-3xl bg-pine-800 p-8 text-white sm:p-10">
          <Img src="/images/site/map.jpg" alt="" fill sizes="(min-width:1024px) 600px, 100vw" className="-z-20 object-cover object-top opacity-50 transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pine-950 via-pine-900/85 to-pine-900/20" />
          <div className="flex max-w-sm flex-col justify-end">
            <Map className="size-9 text-saffron" />
            <h3 className="mt-4 font-display text-3xl font-semibold">Map of AJK</h3>
            <p className="mt-3 text-white/80">Ten districts in three divisions, from the Neelum Valley in the north to Bhimber in the south.</p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-saffron">
              View the map <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
        <div className="flex flex-col justify-between rounded-3xl bg-chinar p-8 text-white sm:p-10">
          <div>
            <Siren className="size-9 text-saffron-50" />
            <h3 className="mt-4 font-display text-3xl font-semibold">In an emergency</h3>
            <p className="mt-3 max-w-md text-white/85">Police control rooms, district hospitals, rescue services and telephone exchanges for every district, in one searchable list.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/helplines" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-chinar-700 transition hover:bg-saffron-50">
              <Phone className="size-4" /> All helplines
            </Link>
            <Link href="/helplines?c=Hospitals" className="inline-flex items-center gap-2 rounded-full border border-white/50 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">
              Hospitals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
