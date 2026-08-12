# Editing this site

Everything on this site is data-driven — the actual page components rarely need to
change. To update content, edit the relevant JSON file (and images), then deploy.
No local build is required to publish; GitHub Actions builds and deploys
automatically on every push to `main`.

## Where to edit what

| What you want to change | File(s) to edit |
| --- | --- |
| Home page (name, typewriter roles, status line) | `public/profile/home.json` |
| About bio text, profile photo | `public/profile/about.json` (+ photo in `public/images/about/`) |
| Skills (Main Stacks icons, Languages) — shown on About page | `public/profile/skills.json` |
| Education (degree, GPA, school) — shown on About page | `public/profile/education.json` |
| Experience (SISS / SNSec Lab / BOAZ timeline, sub-activities, photos) | `public/profile/experiences.json` (+ photos in `public/images/experience/`) |
| Projects (all cards + modal detail content) | `public/profile/projects.json` (+ photos in `public/images/projects/`) |
| Social links (LinkedIn/GitHub/blog/email icons) | `public/profile/social.json` |
| Nav bar items / order | `public/profile/navbar.json` |
| Page routes (rarely needed — only if adding a whole new top-level page) | `public/profile/routes.json` |
| Resume | Drop the actual PDF at `public/resume.pdf` (exact filename — the nav link already points there, nothing else to change) |
| Terminal easter egg (banner, commands, social links inside it) | `tools/webshell/config.json` and `tools/webshell/src/` — see `tools/webshell/REBUILD.md` for the rebuild step this needs |
| Favicon | `index.html`, the `<link rel="icon">` tag |

## Writing a new blog post

1. Add an entry to `public/profile/blog.json`'s `posts` array:
   ```json
   {
     "slug": "my-new-post",
     "title": "My New Post",
     "date": "2026-09-01",
     "category": "General",
     "coverImage": "/images/blog/my-photo.jpg",
     "contentFile": "/blog-content/my-new-post.md"
   }
   ```
   `coverImage` is optional — omit it and the card shows a 📝 placeholder instead.
2. Write the post body as plain Markdown at `public/blog-content/my-new-post.md`
   (matches the `contentFile` path above).
3. If you're using a cover image, drop it in `public/images/blog/`.

The post automatically shows up on `/blog`, sorted newest-first by `date`, and gets
its own page at `/blog/<slug>`.

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
