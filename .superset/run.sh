#!/usr/bin/env bash
# Start the dev server for whatever stack the repo uses.
set -euo pipefail

if [[ -f package.json ]]; then
  if [[ -f bun.lock || -f bun.lockb ]]; then pm=bun
  elif [[ -f pnpm-lock.yaml ]]; then pm=pnpm
  elif [[ -f yarn.lock ]]; then pm=yarn
  else pm=npm
  fi
  for script in dev start; do
    if node -e "process.exit(require('./package.json').scripts?.['$script'] ? 0 : 1)" 2>/dev/null; then
      exec "$pm" run "$script"
    fi
  done
fi

if [[ -f Gemfile ]] && grep -q jekyll Gemfile; then
  exec bundle exec jekyll serve --livereload --port "${PORT:-4000}"
fi

if [[ -f hugo.toml || -f hugo.yaml || -f hugo.json ]]; then
  exec hugo server --port "${PORT:-1313}"
fi

if [[ -f index.html ]]; then
  exec python3 -m http.server "${PORT:-8000}"
fi

echo "No dev server detected (no package.json dev/start script, Jekyll, Hugo, or index.html)." >&2
exit 1
