import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone, Siren } from "lucide-react";
import { readDB } from "@/lib/store";
import { PageHero } from "@/components/site/SiteFooter";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const { settings: s } = await readDB();
  return (
    <>
      <PageHero eyebrow="Get in touch" title="Contact the Government of AJK" text="Send a question, suggestion or complaint. For emergencies, call the numbers on the helplines page." image="/images/site/muzaffarabad-bridge.jpg" />
      <section className="container-ajk grid gap-12 py-16 lg:grid-cols-[1fr_1.6fr]">
        <aside className="space-y-5">
          <div className="rounded-3xl border border-line bg-white p-6">
            <ul className="space-y-4 text-pine-900">
              <li className="flex gap-3">
                <MapPin className="size-5 shrink-0 text-chinar" /> {s.contactAddress}
              </li>
              {s.contactPhone && (
                <li className="flex gap-3">
                  <Phone className="size-5 shrink-0 text-chinar" /> {s.contactPhone}
                </li>
              )}
              {s.contactEmail && (
                <li className="flex gap-3">
                  <Mail className="size-5 shrink-0 text-chinar" /> {s.contactEmail}
                </li>
              )}
            </ul>
          </div>
          <Link href="/helplines" className="flex items-center gap-4 rounded-3xl bg-chinar p-6 text-white transition hover:bg-chinar-700">
            <Siren className="size-8 shrink-0" />
            <span>
              <span className="block font-semibold">Emergency?</span>
              <span className="text-sm text-white/85">Police, rescue and hospital numbers for every district</span>
            </span>
          </Link>
        </aside>
        <div className="rounded-3xl border border-line bg-white p-6 sm:p-10">
          <h2 className="mb-6 font-display text-2xl font-semibold text-pine-900">Send us a message</h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
