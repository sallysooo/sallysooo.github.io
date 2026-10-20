// Builds the Blog tab's post list from the Markdown files themselves.
//
// Each post is a single file in public/blog-content/<slug>.md whose YAML front
// matter holds its metadata (title, date, category, coverImage, draft). The
// list the site fetches at /profile/blog.json is generated from those files by
// the Vite plugin in vite.config.js, so adding a post — by hand or from the
// /admin CMS — never needs a second file edited.

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

// YAML may hand dates back as Date objects; the site expects 'YYYY-MM-DD'.
function toDateString(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value ? String(value) : '';
}

export function parsePost(fileName, source) {
  const match = source.match(FRONT_MATTER);
  const meta = (match && parse(match[1])) || {};
  const slug = path.basename(fileName, '.md');

  return {
    slug,
    title: meta.title ? String(meta.title) : slug,
    date: toDateString(meta.date),
    category: meta.category || undefined,
    coverImage: meta.coverImage || undefined,
    draft: meta.draft === true,
    contentFile: `/blog-content/${fileName}`,
  };
}

export function buildBlogIndex(contentDir) {
  const posts = fs.readdirSync(contentDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parsePost(f, fs.readFileSync(path.join(contentDir, f), 'utf8')))
    .filter((p) => !p.draft)
    .map(({ draft, ...post }) => post)
    .sort((a, b) => b.date.localeCompare(a.date));

  return { posts };
}
