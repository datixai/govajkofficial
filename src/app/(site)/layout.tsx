import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { byOrder, readDB } from "@/lib/store";

// Content is edited live from the admin panel, so pages render per request.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const db = await readDB();
  const departments = byOrder(db.departments).map(({ name, url, category }) => ({ name, url, category }));
  return (
    <>
      <SiteHeader
        siteName={db.settings.siteName}
        urduName={db.settings.urduName}
        departments={departments}
        jobsUrl={db.settings.jobsUrl}
        tendersUrl={db.settings.tendersUrl}
      />
      <main id="main">{children}</main>
      <SiteFooter settings={db.settings} />
    </>
  );
}
