import { defineConfig } from 'astro/config';

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
    },
  },
});
