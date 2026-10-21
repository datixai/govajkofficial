import type { Metadata } from "next";
import { byOrder, readDB } from "@/lib/store";
import { PageHero } from "@/components/site/SiteFooter";
import { DepartmentDirectory } from "@/components/site/Directories";
import { DEPARTMENT_CATEGORIES } from "@/lib/schema";

export const metadata: Metadata = { title: "Departments" };

export default async function DepartmentsPage() {
  const db = await readDB();
  const cats = [...new Set([...DEPARTMENT_CATEGORIES, ...db.departments.map((d) => d.category)])].filter((c) => db.departments.some((d) => d.category === c));
  return (
    <>
      <PageHero eyebrow="Directory" title="Departments & offices" text="Courts, departments, authorities, institutions and online services of the Government of AJ&K." image="/images/site/muzaffarabad-bridge.jpg" />
      <section className="container-ajk py-14">
        <DepartmentDirectory departments={byOrder(db.departments)} categories={cats} />
      </section>
    </>
  );
}
