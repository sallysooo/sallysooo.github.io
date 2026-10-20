// Sanity-checks the site's content before every build (npm "prebuild"), so a
// bad edit — by hand or from the /admin CMS — fails the deploy and leaves the
// previous version of the site live, instead of shipping a broken page.
//
// Checks: every public/profile/*.json parses, the keys each page relies on are
// present, every blog post has a title and date, and every local image or file
// path referenced from the content actually exists under public/, and
// public/.nojekyll is in place.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBlogIndex } from './blog-index.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const PROFILE = path.join(PUBLIC, 'profile');
const BLOG_DIR = path.join(PUBLIC, 'blog-content');

// Required keys per list item, for the files the CMS edits.
const REQUIRED = {
  'projects.json': { list: 'projects', keys: ['title', 'category', 'bodyText'] },
  'experiences.json': { list: 'experiences', keys: ['title', 'subtitle', 'dateText'] },
  'publications.json': { list: 'publications', keys: ['year', 'type', 'venue', 'title'] },
};

const LOCAL_ASSET = /^\/(images|blog-content)\//;
const MARKDOWN_ASSET = /\]\((\/(?:images|blog-content)\/[^)\s]+)\)/g;

function collectAssetPaths(value, found) {
  if (typeof value === 'string') {
    if (LOCAL_ASSET.test(value)) found.add(value);
    for (const m of value.matchAll(MARKDOWN_ASSET)) found.add(m[1]);
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectAssetPaths(v, found));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((v) => collectAssetPaths(v, found));
  }
  return found;
}

export function checkContent() {
  const errors = [];
  const assets = new Map(); // asset path -> where it's referenced

  const note = (where, value) => {
    collectAssetPaths(value, new Set()).forEach((p) => assets.set(p, where));
  };

  for (const file of fs.readdirSync(PROFILE).filter((f) => f.endsWith('.json'))) {
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(PROFILE, file), 'utf8'));
    } catch (err) {
      errors.push(`${file}: not valid JSON (${err.message})`);
      continue;
    }
    note(file, data);

    const rule = REQUIRED[file];
    if (rule) {
      const items = data[rule.list];
      if (!Array.isArray(items)) {
        errors.push(`${file}: "${rule.list}" must be a list`);
      } else {
        items.forEach((item, i) => {
          rule.keys
            .filter((k) => item[k] === undefined || item[k] === '')
            .forEach((k) => errors.push(`${file}: item #${i + 1} (${item.title || 'untitled'}) is missing "${k}"`));
        });
      }
    }
  }

  for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))) {
    const source = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    note(`blog-content/${file}`, source);
  }
  for (const post of buildBlogIndex(BLOG_DIR).posts) {
    if (!post.date) errors.push(`blog-content/${post.slug}.md: missing "date"`);
    if (post.date && Number.isNaN(Date.parse(post.date))) errors.push(`blog-content/${post.slug}.md: "date" is not a date (${post.date})`);
    note(`blog-content/${post.slug}.md`, post);
  }

  // Without it, GitHub Pages runs Jekyll over the site, which turns every
  // blog post with front matter into an .html page and drops the .md file the
  // Blog tab fetches.
  if (!fs.existsSync(path.join(PUBLIC, '.nojekyll'))) {
    errors.push('public/.nojekyll is missing (GitHub Pages would hide the blog posts)');
  }

  for (const [asset, where] of assets) {
    const onDisk = path.join(PUBLIC, decodeURI(asset));
    if (!fs.existsSync(onDisk)) errors.push(`${where}: file not found: ${asset}`);
  }

  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = checkContent();
  if (errors.length) {
    console.error(`Content check failed (${errors.length}):`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log('Content check passed.');
}
