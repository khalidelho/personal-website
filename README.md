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

## Deploy

`.github/workflows/deploy.yml` builds the site and résumé PDF on GitHub
Actions and uploads `dist/` to Cloudflare Pages: pushes to `main` go to
production, pull requests get a preview URL, and a daily run picks up new
Medium posts. It needs these repository secrets: `CLOUDFLARE_API_TOKEN`
(Account › Cloudflare Pages › Edit), `CLOUDFLARE_ACCOUNT_ID`, `MEDIUM_HANDLE`,
`CONTACT_EMAIL`, and `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` for the
failure alert. `public/_headers` sets the response headers.

## Leak guard

`.githooks/pre-commit` runs `scripts/check-leaks.sh`, which blocks common
secret shapes (API keys, tokens, private keys) plus my own two deny lists of
private names, kept outside the repo. Enable it with `git config core.hooksPath .githooks`.
Without both deny lists at the paths the script names, it refuses to run; set
`ALLOW_NO_DENYLIST=1` to scan for secrets only.

## Credits

Icons from [Lucide](https://lucide.dev) (ISC) and
[Simple Icons](https://simpleicons.org) (CC0); fonts Inter and Inter Tight
(OFL). Full texts in `public/licenses.txt`.
