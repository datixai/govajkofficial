"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Phone, Search } from "lucide-react";
import { Img } from "./Img";

interface Dept {
  id: string;
  name: string;
  url: string;
  category: string;
  logo: string;
}
interface Help {
  id: string;
  category: string;
  group: string;
  designation: string;
  number: string;
}

function SearchBox({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={label} aria-label={label} className="h-12 w-full rounded-full border border-line bg-white pl-11 pr-4 outline-none focus:border-pine-500" />
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-pine-700 text-white" : "bg-white text-pine-800 ring-1 ring-line hover:ring-pine-500"}`}>
      {children}
    </button>
  );
}

export function DepartmentDirectory({ departments, categories }: { departments: Dept[]; categories: string[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const list = departments.filter((d) => (!cat || d.category === cat) && d.name.toLowerCase().includes(q.toLowerCase()));
  const grouped = categories.map((c) => [c, list.filter((d) => d.category === c)] as const).filter(([, l]) => l.length);
  return (
    <>
      <div className="flex flex-col gap-4">
        <SearchBox value={q} onChange={setQ} label="Search departments" />
        <div className="flex flex-wrap gap-2">
          <Chip active={!cat} onClick={() => setCat("")}>
            All
          </Chip>
          {categories.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>
      {grouped.length === 0 && <p className="mt-10 text-muted">No departments match your search.</p>}
      {grouped.map(([c, items]) => (
        <div key={c} className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-pine-900">{c}</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((d) => (
              <li key={d.id}>
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="group flex h-full items-center gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-pine-500 hover:shadow-lg">
                  <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-pine-50 font-display font-semibold text-pine-700">
                    {d.logo ? <Img src={d.logo} alt="" fill sizes="48px" className="object-contain p-1" /> : d.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-pine-900">{d.name}</span>
                    <span className="block truncate text-xs text-muted">{d.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-muted transition group-hover:text-chinar" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export function HelplineDirectory({ helplines, categories, initial }: { helplines: Help[]; categories: string[]; initial: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initial);
  const groups = useMemo(() => {
    const term = q.toLowerCase();
    const rows = helplines.filter((h) => (term ? true : h.category === cat) && `${h.group} ${h.designation} ${h.number} ${h.category}`.toLowerCase().includes(term));
    const map = new Map<string, Help[]>();
    rows.forEach((h) => {
      const key = term ? `${h.category}: ${h.group}` : h.group;
      map.set(key, [...(map.get(key) ?? []), h]);
    });
    return [...map.entries()];
  }, [helplines, cat, q]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <SearchBox value={q} onChange={setQ} label="Search by district, office or number" />
        <div className="flex flex-wrap gap-2" role="tablist">
          {categories.map((c) => (
            <Chip key={c} active={!q && cat === c} onClick={() => (setCat(c), setQ(""))}>
              {c}
            </Chip>
          ))}
        </div>
      </div>
      {groups.length === 0 && <p className="mt-10 text-muted">Nothing found.</p>}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {groups.map(([g, rows]) => (
          <div key={g} className="overflow-hidden rounded-3xl border border-line bg-white">
            <h2 className="bg-pine-900 px-6 py-4 font-semibold text-white">{g}</h2>
            <ul className="divide-y divide-line">
              {rows.map((h) => (
                <li key={h.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <span className="text-pine-900">{h.designation}</span>
                  {h.number ? (
                    <a href={`tel:${h.number.replace(/\(0\)/, "").replace(/-(\d{2})(-\d{2})*$/, "").replace(/[^\d+]/g, "")}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-pine-50 px-3 py-1.5 font-mono text-sm font-semibold text-pine-700 hover:bg-pine-700 hover:text-white">
                      <Phone className="size-3.5" /> {h.number}
                    </a>
                  ) : (
                    <span className="shrink-0 text-xs text-muted">Number not listed</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
