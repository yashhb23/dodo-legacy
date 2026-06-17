// Fetch 16 authentic, free-licensed Mauritius images from Wikimedia Commons.
// For each milestone: search the Commons API, take the best image hit,
// download a 1200px render, and log attribution for CREDITS.md.
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve("frontend/public/assets/images/history/stack");
const UA = "DodoLegacyBot/1.0 (heritage site image research; contact: site owner)";

const MILESTONES = [
  { n: 1,  slug: "mauritia-gondwana",    queries: ["Gondwana reconstruction map", "Mauritia microcontinent"] },
  { n: 2,  slug: "dina-arobi-cantino",   queries: ["Cantino planisphere", "Cantino world map 1502"] },
  { n: 3,  slug: "dutch-dodo",           queries: ["Edwards' Dodo Savery", "Roelant Savery dodo painting"] },
  { n: 4,  slug: "isle-de-france",       queries: ["Mahé de La Bourdonnais portrait", "La Bourdonnais statue Port Louis"] },
  { n: 5,  slug: "british-cession",      queries: ["Battle of Grand Port", "Combat de Grand Port 1810"] },
  { n: 6,  slug: "abolition-le-morne",   queries: ["Le Morne Brabant mountain", "Le Morne Brabant"] },
  { n: 7,  slug: "great-experiment",     queries: ["indentured labourers Mauritius", "Indian immigrants Mauritius 19th century"] },
  { n: 8,  slug: "literacy-franchise",   queries: ["Government House Port Louis Mauritius", "Port Louis colonial building"] },
  { n: 9,  slug: "universal-suffrage",   queries: ["Parliament Mauritius", "National Assembly Mauritius building"] },
  { n: 10, slug: "independence-1968",    queries: ["Seewoosagur Ramgoolam", "Mauritius independence 1968"] },
  { n: 11, slug: "economic-miracle",     queries: ["Port Louis harbour Mauritius", "Mauritius sugar cane field"] },
  { n: 12, slug: "republic-1992",        queries: ["Port Louis skyline", "Port Louis Mauritius city"] },
  { n: 13, slug: "unesco-memory",        queries: ["Aapravasi Ghat", "Aapravasi Ghat World Heritage"] },
  { n: 14, slug: "knowledge-economy",    queries: ["Cyber Tower Ebene Mauritius", "Ebene CyberCity Mauritius building"] },
  { n: 15, slug: "chagos-2025",          queries: ["Diego Garcia aerial", "Chagos Archipelago"] },
  { n: 16, slug: "mauritius-today",      queries: ["Mauritius coastline", "Belle Mare beach Mauritius", "Mauritius lagoon"] },
];

const api = (params) =>
  fetch(`https://commons.wikimedia.org/w/api.php?${new URLSearchParams({ format: "json", origin: "*", ...params })}`, {
    headers: { "User-Agent": UA },
  }).then((r) => r.json());

async function findFile(query) {
  const res = await api({ action: "query", list: "search", srsearch: query, srnamespace: "6", srlimit: "8" });
  const hits = res?.query?.search ?? [];
  return hits.find((h) => /\.(jpe?g|png)$/i.test(h.title))?.title ?? null;
}

async function download(fileTitle, dest) {
  const name = fileTitle.replace(/^File:/, "");
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=1200`;
  const r = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 8000) throw new Error(`suspiciously small (${buf.length}B)`);
  await writeFile(dest, buf);
  return buf.length;
}

const ONLY = new Set(process.argv.slice(2).map(Number));
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

await mkdir(OUT_DIR, { recursive: true });
const credits = [];

for (const m of MILESTONES) {
  if (ONLY.size && !ONLY.has(m.n)) continue;
  await sleep(4000);
  let done = false;
  for (const q of m.queries) {
    try {
      const title = await findFile(q);
      if (!title) continue;
      const dest = path.join(OUT_DIR, `${String(m.n).padStart(2, "0")}-${m.slug}.jpg`);
      const bytes = await download(title, dest);
      const pageUrl = `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
      credits.push(`${m.n}. ${m.slug} — "${title}" — ${pageUrl}`);
      console.log(`OK  ${m.n}\t${title}\t${(bytes / 1024).toFixed(0)}KB`);
      done = true;
      break;
    } catch (e) {
      console.log(`..  ${m.n}\tretry (${q}): ${e.message}`);
      await sleep(8000);
    }
  }
  if (!done) {
    credits.push(`${m.n}. ${m.slug} — FAILED, needs manual image`);
    console.log(`FAIL ${m.n} ${m.slug}`);
  }
}

const { appendFile } = await import("node:fs/promises");
await appendFile(
  path.join(OUT_DIR, "CREDITS.md"),
  `\n${credits.join("\n")}\n`,
).catch(async () => {
  await writeFile(
    path.join(OUT_DIR, "CREDITS.md"),
    `# Image credits — Wikimedia Commons\n\nAll images sourced from Wikimedia Commons (free licenses; see each file page for author/license).\n\n${credits.join("\n")}\n`,
  );
});
console.log("\nDone. Credits written.");
