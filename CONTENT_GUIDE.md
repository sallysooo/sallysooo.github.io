# Editing this site

Everything on this site is data-driven — the actual page components rarely need to
change. To update content, edit the relevant JSON file (and images), then deploy.
No local build is required to publish; GitHub Actions builds and deploys
automatically on every push to `main`.

## Where to edit what

| What you want to change | File(s) to edit |
| --- | --- |
| Anything below, from your phone | **https://sallysooo.com/admin/** — see [Editing from your phone](#editing-from-your-phone-admin) |
| Home page (name, typewriter roles, status line) | `public/profile/home.json` |
| About bio text, profile photo | `public/profile/about.json` (+ photo in `public/images/about/`) |
| Skills (Main Stacks icons, Languages) — shown on About page | `public/profile/skills.json` |
| Education (degree, GPA, school) — shown on About page | `public/profile/education.json` |
| Experience (SISS / SNSec Lab / BOAZ timeline, sub-activities, photos) | `public/profile/experiences.json` (+ photos in `public/images/experience/`) |
| Publications (papers, grouped by year on `/publications`) | `public/profile/publications.json` (+ images in `public/images/publications/`) — see below |
| Projects (all cards + modal detail content) | `public/profile/projects.json` (+ photos in `public/images/projects/`) |
| Social links (LinkedIn/GitHub/blog/email icons) | `public/profile/social.json` |
| Nav bar items / order | `public/profile/navbar.json` |
| Page routes (rarely needed — only if adding a whole new top-level page) | `public/profile/routes.json` |
| Resume | Drop the actual PDF at `public/resume.pdf` (exact filename — the nav link already points there, nothing else to change) |
| Terminal easter egg (banner, commands, social links inside it) | `tools/webshell/config.json` and `tools/webshell/src/` — see `tools/webshell/REBUILD.md` for the rebuild step this needs |
| Favicon | `index.html`, the `<link rel="icon">` tag |

## Adding a publication

Add an entry to `public/profile/publications.json`'s `publications` array. Entries
are grouped by `year` (newest first); within a year they keep the order you write
them in the file.

```json
{
  "year": 2027,
  "type": "Conference",
  "venue": "ACM Conference on Computer and Communications Security (CCS 2027)",
  "venueDetail": "pp. 1–15",
  "title": "Paper Title",
  "authors": ["Jisoo Kim", "Co Author"],
  "highlights": ["First Author"],
  "tldr": "One or two sentences (Markdown OK).",
  "abstract": "Full abstract — shown behind an expandable 'Abstract' toggle.",
  "image": "/images/publications/my-figure.png",
  "links": [{ "text": "Paper", "href": "https://..." }],
  "bibtex": "@inproceedings{...}"
}
```

- Only `year`, `type`, `venue`, and `title` are required;
  everything else is shown only when present.
- Only list papers that are actually published — work still under review stays
  in Projects until it's out.
- Names listed in the top-level `self` array are bolded in author lists.
- A Journal / Conference / … filter appears automatically once there are two or
  more different `type` values.
- `imagePosition` (e.g. `"left top"`) picks which part of a wide/tall `image` the
  cropped thumbnail shows; clicking the thumbnail opens the full image.
- `bibtex` adds a "BibTeX" button that copies it to the clipboard.

## Editing from your phone (/admin)

The easiest way to update the site — from a phone or any browser — is the
admin page at **https://sallysooo.com/admin/**. It's
[Sveltia CMS](https://sveltiacms.app/): forms for the Blog, Projects,
Experience, Publications, and Home/About content, with photo upload. Saving
commits the change to this repo, and the normal deploy publishes it about 1–2
minutes later.

- **Signing in** uses a GitHub personal access token that only has access to
  this repository (`auth_methods: [token]` in the config). Create it once, paste
  it into the login screen, and the browser remembers it. If a device is lost,
  delete the token on GitHub (Settings → Developer settings → Personal access
  tokens) and nobody can use it any more.
- **Photos** are resized to at most 2048px and converted to WebP on upload, and
  renamed to `YYYYMMDD-<random id>.webp`, so large phone photos are fine.
- The configuration lives in `public/admin/config.yml`. Its field names must
  match the JSON keys the pages read; if you add a new key to a JSON file by
  hand, add it there too or the CMS form won't show it (it keeps the value
  either way).

Editing the files directly (below) still works exactly as before — both ways
end up as commits on `main`.

## Writing a new blog post

Each post is one Markdown file in `public/blog-content/`. Its file name is the
post's URL (`public/blog-content/my-new-post.md` → `/blog/my-new-post`), and its
details go in a front matter block at the top:

```markdown
---
title: My New Post
date: 2026-09-01
category: General
coverImage: /images/blog/my-photo.jpg
---

The post body, in plain Markdown.
```

- `title` and `date` are required; `category` and `coverImage` are optional
  (without a cover image the card shows a 📝 placeholder).
- Add `draft: true` to keep a post in the repo without showing it on the site.
- Put images in `public/images/blog/`.

There's no list to update by hand: the Blog tab's list (`/profile/blog.json`) is
generated from these files at build time by `scripts/blog-index.mjs`, sorted
newest-first by `date`.

## Content check before every deploy

`npm run build` first runs `npm run check:content` (`scripts/check-content.mjs`),
which fails the build if a profile JSON file is invalid, a project, experience,
or publication is missing a required field, a blog post has no valid date, or
any `/images/...` path in the content points at a file that doesn't exist. A
failed check means the deploy is skipped and the previous version of the site
stays live — GitHub emails you about the failed run, and the error message says
which file and field to fix.

## The Tech tab (Tistory sync)

The **Tech** tab on `/blog` mirrors the latest posts from the
[Tistory tech blog](https://sallysooo.tistory.com/) — title, date, category, first
image, and an excerpt, pulled from its public RSS feed. You never edit this by hand:

- `scripts/sync-tech-blog.mjs` fetches the RSS feed and writes
  `public/profile/tech-blog.json`.
- `.github/workflows/sync-tech-blog.yml` runs that script automatically once a day
  and pushes the result if anything changed, which in turn triggers the normal
  deploy. So a new Tistory post shows up here within about a day, with nothing to do
  on your end.
- To pull the latest posts immediately instead of waiting for the daily run, either
  trigger the "Sync tech blog" workflow manually from the
  [Actions tab](https://github.com/sallysooo/sallysooo.github.io/actions), or run it
  locally:
  ```bash
  npm run sync:tech-blog
  git add public/profile/tech-blog.json
  git commit -m "Sync tech blog posts"
  git push origin main
  ```

Tistory's RSS feed only exposes the latest 10 posts, so that's the cap here too —
older posts stay on the Tistory blog itself but won't appear in this tab.

## Deploying

Once you've edited the files above:

```bash
git add -A
git commit -m "describe what you changed"
git push origin main
```

That's it — pushing to `main` triggers the GitHub Actions workflow
(`.github/workflows/deploy.yml`), which builds the site and deploys it to
sallysooo.com. Check progress at:
https://github.com/sallysooo/sallysooo.github.io/actions

### Previewing locally before you push (optional but recommended for bigger edits)

```bash
npm install   # only needed once, or after package.json changes
npm run dev
```

Opens the site at `http://localhost:5173` with hot-reload — edit a JSON file and
the page updates immediately, no restart needed.
