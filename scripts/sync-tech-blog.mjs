// Fetches the latest posts from the Tistory tech blog's RSS feed and writes
// them to public/profile/tech-blog.json as a static asset. Runs at build/CI
// time (not in the browser) so it never hits Tistory's CORS restrictions.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const RSS_URL = 'https://sallysooo.tistory.com/rss';
const OUTPUT_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../public/profile/tech-blog.json',
);

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, name) => NAMED_ENTITIES[name]);
}

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return match ? match[1].trim() : '';
}

function toExcerpt(html, maxLength = 160) {
  const text = decodeEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

function extractThumbnail(html) {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

async function main() {
  const res = await fetch(RSS_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; sallysooo-portfolio-sync/1.0)' },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Tistory RSS: HTTP ${res.status}`);
  }
  const xml = await res.text();

  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

  const posts = items.map((item) => {
    const title = decodeEntities(decodeEntities(extractTag(item, 'title')));
    const link = extractTag(item, 'link');
    const category = decodeEntities(decodeEntities(extractTag(item, 'category')));
    const pubDate = extractTag(item, 'pubDate');
    const descriptionHtml = decodeEntities(extractTag(item, 'description'));

    return {
      title,
      link,
      date: new Date(pubDate).toISOString().slice(0, 10),
      category: category || null,
      thumbnail: extractThumbnail(descriptionHtml),
      excerpt: toExcerpt(descriptionHtml),
    };
  }).sort((a, b) => b.date.localeCompare(a.date));

  await writeFile(OUTPUT_PATH, `${JSON.stringify({ posts }, null, 4)}\n`);
  console.log(`Wrote ${posts.length} tech blog posts to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
