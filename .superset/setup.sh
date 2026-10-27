#!/usr/bin/env bash
# Prepare a fresh Superset workspace. Idempotent; detects the stack at run time
# so it keeps working as the site's tooling changes.
set -euo pipefail

root="${SUPERSET_ROOT_PATH:-}"

# Leak guard (.githooks/pre-commit).
git config core.hooksPath .githooks

# Env files are gitignored: copy them from the main checkout, never overwrite.
if [[ -n "$root" && "$root" != "$PWD" ]]; then
  for f in "$root"/.env "$root"/.env.*; do
    [[ -f "$f" ]] || continue
    name="$(basename "$f")"
    [[ "$name" == *.example || "$name" == *.sample ]] && continue
    [[ -e "$name" ]] || { cp "$f" "$name"; echo "copied $name from root checkout"; }
  done
fi
# Private working notes are gitignored too: copy them the same way.
if [[ -n "$root" && "$root" != "$PWD" ]]; then
  for f in CLAUDE.md docs/build-log.md; do
    [[ -f "$root/$f" && ! -e "$f" ]] || continue
    mkdir -p "$(dirname "$f")"
    cp "$root/$f" "$f"
    echo "copied $f from root checkout"
  done
fi
if [[ ! -e .env && -f .env.example ]]; then
  cp .env.example .env
  echo "created .env from .env.example"
fi

# JavaScript dependencies, by lockfile.
if [[ -f package.json ]]; then
  if [[ -f bun.lock || -f bun.lockb ]]; then bun install
  elif [[ -f pnpm-lock.yaml ]]; then pnpm install --frozen-lockfile
  elif [[ -f yarn.lock ]]; then yarn install
  elif [[ -f package-lock.json ]]; then npm ci
  else npm install
  fi
fi

# Ruby (e.g. Jekyll).
if [[ -f Gemfile ]]; then
  bundle install
fi

echo "workspace setup complete"
