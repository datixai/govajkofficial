"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink, Menu, Phone, Search, X } from "lucide-react";

export interface NavDept {
  name: string;
  url: string;
  category: string;
}

interface Props {
  siteName: string;
  urduName: string;
  departments: NavDept[];
  jobsUrl: string;
  tendersUrl: string;
}

const ABOUT = [
  { label: "Overview & identity", href: "/about" },
  { label: "History timeline", href: "/about#history" },
  { label: "Days of remembrance", href: "/about#days" },
  { label: "AJ&K map", href: "/ajk-map" },
  { label: "AJ&K at a glance (statistics)", href: "https://pndajk.gov.pk/statyearbook.php?page=AJK%20at%20a%20Glance" },
];

const isExternal = (href: string) => /^https?:\/\//.test(href);

function NavLink({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  if (isExternal(href))
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    );
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function SiteHeader({ siteName, urduName, departments, jobsUrl, tendersUrl }: Props) {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const solid = !overHero || scrolled || open !== null;
  const groups = departments.reduce<Record<string, NavDept[]>>((acc, d) => {
    (acc[d.category] ||= []).push(d);
    return acc;
  }, {});

  const SERVICES = [
    { label: "Helplines & emergency numbers", href: "/helplines" },
    { label: "Jobs", href: jobsUrl },
    { label: "Tenders", href: tendersUrl },
    { label: "e-Facilitation Center", href: "https://efc.ajk.gov.pk" },
    { label: "Qeemat AJK (prices)", href: "https://qeemat.ajk.gov.pk/" },
    { label: "Contact & feedback", href: "/contact" },
  ];

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkCls = (href: string) =>
    `rounded-full px-3.5 py-2 text-[0.9rem] font-medium transition-colors ${
      active(href) ? "bg-white/15 text-white" : "text-white/85 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-saffron focus:px-4 focus:py-2 focus:text-pine-950">
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid ? "bg-pine-900/95 shadow-[0_8px_30px_rgba(0,0,0,.18)] backdrop-blur-md" : "bg-gradient-to-b from-black/55 to-transparent"
        }`}
        onMouseLeave={() => setOpen(null)}
      >
        {/* utility bar */}
        <div className={`hidden border-b border-white/10 text-xs text-white/75 lg:block ${solid ? "" : "border-transparent"}`}>
          <div className="container-ajk flex h-9 items-center justify-between">
            <span className="font-urdu text-sm leading-none" lang="ur" dir="rtl">
              {urduName}
            </span>
            <div className="flex items-center gap-5">
              <Link href="/helplines" className="flex items-center gap-1.5 hover:text-white">
                <Phone className="size-3.5" /> Helplines
              </Link>
              <a href={jobsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Jobs
              </a>
              <a href={tendersUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Tenders
              </a>
              <Link href="/admin" className="hover:text-white">
                Staff login
              </Link>
            </div>
          </div>
        </div>

        <div className="container-ajk flex h-[72px] items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={`${siteName}, home`}>
            <span className="relative size-12 shrink-0 rounded-full bg-white p-0.5 shadow-md ring-2 ring-saffron/70">
              <Image src="/images/site/seal.png" alt="" fill sizes="48px" className="rounded-full object-contain" priority />
            </span>
            <span className="min-w-0 leading-tight text-white">
              <span className="block font-display text-[1.05rem] font-semibold tracking-wide sm:text-lg">Azad Government</span>
              <span className="block truncate text-[0.72rem] text-white/75 sm:text-xs">of the State of Jammu &amp; Kashmir</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex">
            <Link href="/" className={linkCls("/")}>
              Home
            </Link>
            {(
              [
                ["about", "About AJ&K", "/about"],
                ["departments", "Departments", "/departments"],
                ["services", "Services", "/helplines"],
              ] as const
            ).map(([key, label, href], idx) => (
              <div key={key} className="contents">
                {idx === 1 && (
                  <>
                    <Link href="/kashmir-cause" className={linkCls("/kashmir-cause")}>
                      Kashmir Cause
                    </Link>
                    <Link href="/news" className={linkCls("/news")}>
                      News
                    </Link>
                  </>
                )}
                <button
                  type="button"
                  aria-expanded={open === key}
                  onMouseEnter={() => setOpen(key)}
                  onClick={() => setOpen(open === key ? null : key)}
                  className={`${linkCls(href)} flex items-center gap-1`}
                >
                  {label}
                  <ChevronDown className={`size-4 transition-transform ${open === key ? "rotate-180" : ""}`} />
                </button>
              </div>
            ))}
            <a href={jobsUrl} target="_blank" rel="noopener noreferrer" className={linkCls(jobsUrl)}>
              Jobs
            </a>
            <Link href="/contact" className={linkCls("/contact")}>
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <Link href="/search" aria-label="Search" className="grid size-10 place-items-center rounded-full text-white hover:bg-white/10">
              <Search className="size-5" />
            </Link>
            <button type="button" aria-label="Open menu" onClick={() => setMobile(true)} className="grid size-10 place-items-center rounded-full text-white hover:bg-white/10 xl:hidden">
              <Menu className="size-6" />
            </button>
          </div>
        </div>

        {/* dropdown panels */}
        {open && (
          <div className="absolute inset-x-0 top-full hidden border-t border-white/10 bg-pine-900/98 text-white shadow-2xl backdrop-blur-md xl:block">
            <div className="container-ajk py-8">
              {open === "departments" ? (
                <div className="grid grid-cols-5 gap-8">
                  {Object.entries(groups).map(([cat, items]) => (
                    <div key={cat}>
                      <p className="eyebrow mb-3 text-saffron">{cat}</p>
                      <ul className="space-y-1.5">
                        {items.map((d) => (
                          <li key={d.url + d.name}>
                            <a href={d.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-1.5 text-sm text-white/80 hover:text-white">
                              {d.name}
                              <ExternalLink className="mt-1 size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-70" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="col-span-5 border-t border-white/10 pt-5">
                    <Link href="/departments" className="text-sm font-semibold text-saffron hover:underline">
                      Open the full department directory
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="grid grid-cols-3 gap-3">
                  {(open === "about" ? ABOUT : SERVICES).map((l) => (
                    <li key={l.label}>
                      <NavLink href={l.href} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3.5 text-sm text-white/85 transition hover:border-saffron/60 hover:bg-white/5 hover:text-white">
                        {l.label}
                        {isExternal(l.href) && <ExternalLink className="size-3.5 opacity-60" />}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </header>

      {/* mobile drawer */}
      {mobile && (
        <div className="fixed inset-0 z-[60] xl:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/50" onClick={() => setMobile(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[min(88vw,380px)] flex-col overflow-y-auto bg-pine-900 text-white shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="font-display text-lg">Menu</span>
              <button type="button" aria-label="Close menu" onClick={() => setMobile(false)} className="grid size-10 place-items-center rounded-full hover:bg-white/10">
                <X className="size-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4 text-[0.95rem]">
              {[
                ["Home", "/"],
                ["Kashmir Cause", "/kashmir-cause"],
                ["News & Updates", "/news"],
                ["Departments", "/departments"],
                ["Helplines", "/helplines"],
                ["Contact", "/contact"],
                ["Search", "/search"],
              ].map(([l, h]) => (
                <Link key={h} href={h} className={`rounded-lg px-3 py-2.5 ${active(h) ? "bg-white/10 font-semibold" : "hover:bg-white/5"}`}>
                  {l}
                </Link>
              ))}
              <p className="eyebrow mt-4 px-3 text-saffron">About AJ&amp;K</p>
              {ABOUT.map((l) => (
                <NavLink key={l.label} href={l.href} className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/5" onClick={() => setMobile(false)}>
                  {l.label}
                </NavLink>
              ))}
              <p className="eyebrow mt-4 px-3 text-saffron">Services</p>
              {SERVICES.slice(1, 5).map((l) => (
                <NavLink key={l.label} href={l.href} className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/5">
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
