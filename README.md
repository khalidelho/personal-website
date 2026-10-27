# Personal website

My portfolio: projects, experience, writing and a printable résumé. A static
site built with [Astro](https://astro.build), in a "Swiss Index" style: white
paper, one red accent, a numbered project index. It has a dark mode, and the
only client JavaScript is a few KB for motion and small interactions.

## Run it

```bash
npm ci
npm run dev         # http://localhost:4321
npm run check       # type check
npm run build       # static site in dist/
npm run resume:pdf  # print /resume to public/resume.pdf (needs Google Chrome), then rebuild
```

Content lives in `src/data/` (`site.ts`, `projects.ts`, `resume.ts`). The
Medium handle and contact email come from `.env` at build time (see
`.env.example`); empty values hide the parts that need them.

## Leak guard

`.githooks/pre-commit` runs `scripts/check-leaks.sh`, which blocks common
secret shapes (API keys, tokens, private keys) plus my own deny list of private
names, kept outside the repo. Enable it with `git config core.hooksPath .githooks`.
Without a deny list at the path the script names, it refuses to run; set
`ALLOW_NO_DENYLIST=1` to scan for secrets only.

## Credits

Icons from [Lucide](https://lucide.dev) (ISC) and
[Simple Icons](https://simpleicons.org) (CC0); fonts Inter and Inter Tight
(OFL). Full texts in `public/licenses.txt`.
