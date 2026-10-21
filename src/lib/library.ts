import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { DB } from "./types";

/** Images an admin can pick: uploaded files plus the bundled site photos. */
export async function imageLibrary(db: DB) {
  const dir = path.join(process.cwd(), "public", "images", "site");
  let site: string[] = [];
  try {
    site = (await fs.readdir(dir)).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));
  } catch {}
  return [
    ...db.media.filter((m) => m.type.startsWith("image/")).map((m) => ({ url: m.url, name: m.name })),
    ...site.map((f) => ({ url: `/images/site/${f}`, name: f })),
  ];
}
