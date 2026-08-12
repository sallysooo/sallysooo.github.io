# Rebuilding the terminal easter egg

This is a vendored copy of [nasan016/webshell](https://github.com/nasan016/webshell)
(MIT), customized for the Home page's `>_` terminal overlay. It's a separate
Vite + TypeScript project — **not** part of the main app's build. The main
site only ever loads the prebuilt static output from `public/terminal/`.

Edit `config.json` (banner text, username/hostname, password, social links,
projects list, colors) or the files under `src/` — same as any other Vite
project — then rebuild and sync the output into the main app:

```bash
cd tools/webshell
npm install        # first time only
npm run build       # outputs to tools/webshell/dist/
rsync -a --delete dist/ ../../public/terminal/
```

Then commit both `tools/webshell/` (the source change) and
`public/terminal/` (the rebuilt output) together.

## Known patch: don't lose this on a fresh clone of upstream

`src/commands/projects.ts` and `src/commands/help.ts` pad columns with
`SPACE.repeat(17 - label.length)`, which throws a `RangeError` once a real
project title or handle exceeds 17 characters (the upstream demo only ever
used short placeholder values, so this never came up there). Both are
patched to `SPACE.repeat(Math.max(1, 17 - label.length))`. If you ever
re-clone a fresh copy of upstream webshell instead of editing this vendored
one, reapply that patch first.

## Other changes from upstream

- `index.html`'s Font Awesome `<script>` pointed at the original author's
  personal `kit.fontawesome.com` account; swapped for the public cdnjs
  Font Awesome build so the `about` command's icons don't depend on
  someone else's account staying alive.
- `vite.config.ts` sets `base: '/terminal/'` since this is served from a
  subpath of the main site, not the domain root.
