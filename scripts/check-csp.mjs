// Fails when a built page has an inline <script> or <style> that its Content-Security-Policy
// <meta> doesn't hash. The browser would block it with no build error, so CI runs this after
// the build. Usage: node scripts/check-csp.mjs [dist]
import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const dir = process.argv[2] ?? 'dist';
const pages = (await readdir(dir, { recursive: true })).filter((f) => f.endsWith('.html'));
let bad = 0;
for (const page of pages) {
  const html = await readFile(join(dir, page), 'utf8');
  const csp = html.match(/<meta http-equiv="content-security-policy" content="([^"]*)"/i)?.[1];
  if (!csp) {
    console.error(`✗ ${page}: no CSP <meta>`);
    bad++;
    continue;
  }
  for (const [, tag, attrs, body] of html.matchAll(/<(script|style)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    if (/\bsrc=/i.test(attrs)) continue; // external files are covered by 'self'
    const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
    if (!csp.includes(hash)) {
      console.error(`✗ ${page}: inline <${tag}> not in the CSP (${hash}): ${body.trim().slice(0, 60)}…`);
      bad++;
    }
  }
  if (/\sstyle="/i.test(html) || /\son[a-z]+="/i.test(html)) {
    console.error(`✗ ${page}: inline style= or on*= attribute (blocked by the CSP)`);
    bad++;
  }
}
if (bad) process.exit(1);
console.log(`✓ CSP covers every inline script and style in ${pages.length} pages`);
