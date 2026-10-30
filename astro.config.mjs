import { createHash } from 'node:crypto';
import { defineConfig } from 'astro/config';
import { boot } from './src/scripts/boot.mjs';

export default defineConfig({
  // No code blocks on the site; Shiki's inline styles would also need a CSP exception.
  markdown: { syntaxHighlight: false },
  // A Content-Security-Policy <meta> on every page. Astro hashes the scripts and styles it
  // emits, so nothing else (an injected <script>, a third-party embed) can run. Directives
  // that only work as a header (frame-ancestors) live in public/_headers.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ],
      // Astro doesn't hash <script is:inline>; the pre-paint boot script is hashed here, from
      // the same string Base.astro renders. scripts/check-csp.mjs checks nothing is missed.
      scriptDirective: {
        hashes: [`sha256-${createHash('sha256').update(boot).digest('base64')}`],
      },
    },
  },
});
