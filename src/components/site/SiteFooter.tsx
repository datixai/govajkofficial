import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import type { Settings } from "@/lib/types";
import { ChinarLeaf } from "./ChinarLeaf";

function Social({ href, label, path }: { href: string; label: string; path: string }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-saffron hover:text-saffron">
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
}

export function SiteFooter({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  const cols: [string, [string, string][]][] = [
    [
      "About",
      [
        ["Overview & identity", "/about"],
        ["History timeline", "/about#history"],
        ["The Kashmir Cause", "/kashmir-cause"],
        ["AJK map", "/ajk-map"],
      ],
    ],
    [
      "Media",
      [
        ["News & Updates", "/news"],
        ["Videos", "/videos"],
        ["Search", "/search"],
      ],
    ],
    [
      "Citizens",
      [
        ["Departments", "/departments"],
        ["Helplines", "/helplines"],
        ["Jobs", settings.jobsUrl],
        ["Tenders", settings.tendersUrl],
        ["Contact & feedback", "/contact"],
      ],
    ],
  ];
  return (
    <footer className="relative overflow-hidden bg-pine-950 text-white">
      <div className="h-1.5 bg-[linear-gradient(90deg,#0f5a36_0_25%,#f2a516_25%_50%,#ffffff_50%_75%,#0f5a36_75%)]" aria-hidden="true" />
      <ChinarLeaf className="pointer-events-none absolute -right-24 -top-10 size-[420px] text-white/[0.03]" veins={false} />
      <div className="container-ajk relative grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <div className="flex items-center gap-4">
            <span className="relative size-16 shrink-0 rounded-full bg-white p-1">
              <Image src="/images/site/seal.png" alt="Seal of the Government of AJK" fill sizes="64px" className="object-contain p-0.5" />
            </span>
            <div>
              <p className="font-display text-xl font-semibold">{settings.siteName}</p>
              <p className="mt-1 font-urdu text-base text-white/70" lang="ur" dir="rtl">
                {settings.urduName}
              </p>
            </div>
          </div>
          <ul className="mt-8 space-y-3 text-sm text-white/75">
            {settings.contactAddress && (
              <li className="flex gap-3">
                <MapPin className="size-4 shrink-0 text-saffron" /> {settings.contactAddress}
              </li>
            )}
            {settings.contactPhone && (
              <li className="flex gap-3">
                <Phone className="size-4 shrink-0 text-saffron" /> {settings.contactPhone}
              </li>
            )}
            {settings.contactEmail && (
              <li className="flex gap-3">
                <Mail className="size-4 shrink-0 text-saffron" /> {settings.contactEmail}
              </li>
            )}
          </ul>
          <div className="mt-6 flex gap-2">
            <Social href={settings.facebook} label="Facebook" path="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z" />
            <Social href={settings.twitter} label="X" path="M17.8 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.9L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
            <Social href={settings.youtube} label="YouTube" path="M23 12s0-3.6-.5-5.3a2.8 2.8 0 0 0-2-2C18.8 4.2 12 4.2 12 4.2s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3a2.8 2.8 0 0 0 2 2c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2c.5-1.7.5-5.3.5-5.3ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z" />
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3" aria-label="Flags">
            {[
              ["/images/flags/ajk.jpg", "Flag of Azad Jammu and Kashmir", "Azad Jammu Kashmir"],
              ["/images/flags/pakistan.svg", "Flag of Pakistan", "Pakistan"],
            ].map(([src, alt, label]) => (
              <li key={label} className="flex items-center gap-2.5 text-xs font-medium text-white/70">
                <Image src={src} alt={alt} width={30} height={20} unoptimized className="h-5 w-[30px] rounded-[3px] object-cover shadow-sm ring-1 ring-white/25" />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          {cols.map(([title, links]) => (
            <div key={title}>
              <p className="eyebrow text-saffron">{title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {links.map(([l, h]) => (
                  <li key={l}>
                    {/^https?:/.test(h) ? (
                      <a href={h} target="_blank" rel="noopener noreferrer" className="text-white/75 hover:text-white">
                        {l}
                      </a>
                    ) : (
                      <Link href={h} className="text-white/75 hover:text-white">
                        {l}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-ajk flex flex-col gap-2 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.siteName}. All rights reserved.
          </p>
          <p>{settings.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, text, image }: { eyebrow: string; title: string; text?: string; image?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-pine-900 pb-16 pt-40 text-white sm:pb-20 sm:pt-48">
      {image && <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-35" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-pine-950 via-pine-900/70 to-pine-900/30" />
      <ChinarLeaf className="absolute -bottom-16 right-[-60px] -z-10 size-72 rotate-12 text-chinar/25" veins={false} />
      <div className="container-ajk">
        <p className="eyebrow text-saffron">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-lg text-white/80">{text}</p>}
      </div>
    </section>
  );
}
