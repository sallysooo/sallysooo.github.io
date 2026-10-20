import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { parsePost, buildBlogIndex } from './blog-index.mjs';

describe('parsePost', () => {
  it('reads metadata from front matter and derives the slug from the file name', () => {
    const post = parsePost('hello-world.md', '---\ntitle: Hello\ndate: 2026-09-01\ncategory: Notes\ncoverImage: /images/blog/a.webp\n---\n\nBody');
    expect(post).toEqual({
      slug: 'hello-world',
      title: 'Hello',
      date: '2026-09-01',
      category: 'Notes',
      coverImage: '/images/blog/a.webp',
      draft: false,
      contentFile: '/blog-content/hello-world.md',
    });
  });

  it('accepts quoted dates and full timestamps', () => {
    expect(parsePost('a.md', "---\ntitle: A\ndate: '2026-09-01'\n---\n").date).toBe('2026-09-01');
    expect(parsePost('a.md', '---\ntitle: A\ndate: 2026-09-01T10:00:00\n---\n').date).toBe('2026-09-01T10:00:00');
  });

  it('falls back to the slug when there is no front matter', () => {
    expect(parsePost('plain.md', '# Just text').title).toBe('plain');
  });
});

describe('buildBlogIndex', () => {
  it('skips drafts and non-Markdown files, newest first', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-'));
    fs.writeFileSync(path.join(dir, 'old.md'), '---\ntitle: Old\ndate: 2025-01-01\n---\n');
    fs.writeFileSync(path.join(dir, 'new.md'), '---\ntitle: New\ndate: 2026-01-01\n---\n');
    fs.writeFileSync(path.join(dir, 'wip.md'), '---\ntitle: WIP\ndate: 2026-06-01\ndraft: true\n---\n');
    fs.writeFileSync(path.join(dir, 'notes.txt'), 'ignore me');

    const { posts } = buildBlogIndex(dir);
    expect(posts.map((p) => p.slug)).toEqual(['new', 'old']);
    expect(posts[0]).not.toHaveProperty('draft');
  });
});
