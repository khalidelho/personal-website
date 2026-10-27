#!/usr/bin/env bash
# Refuses to let anything private into the repo. Used as the pre-commit hook (.githooks/pre-commit).
#
#   scripts/check-leaks.sh            scan the working tree (tracked + new files)
#   scripts/check-leaks.sh --staged   scan exactly what is about to be committed
#
# Two lists:
#   1. generic secret/identifier shapes (below) — fine to publish
#   2. a private deny list of words and IDs (employer, tenant, site, resource names, chat IDs)
#      in ${MEDIUM_DENYLIST:-~/.config/private-rag/denylist.txt} — kept OUTSIDE the repo,
#      because the list itself is what must not be published
#
# Deliberate exceptions to the deny list live outside the repo too, in
# ${LEAK_ALLOWLIST:-~/.config/personal-website/leak-allow.txt}: one `path:term` per line (term is the
# matched text, case-insensitive). Each one allows that term in that one file only; every other
# deny term in that file, and that term anywhere else, still fails.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

scope=(--untracked); [ "${1:-}" = "--staged" ] && scope=(--cached)
deny="${MEDIUM_DENYLIST:-$HOME/.config/private-rag/denylist.txt}"
allowlist="${LEAK_ALLOWLIST:-$HOME/.config/personal-website/leak-allow.txt}"
found=0

guid='[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
generic=(
  'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}'              # JWTs (Supabase anon/service keys)
  '[0-9]{8,10}:AA[A-Za-z0-9_-]{30,}'                        # Telegram bot tokens
  'sk-[A-Za-z0-9_-]{20,}'                                   # API keys
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'
  '[A-Za-z0-9-]+\.sharepoint\.com'                          # a real tenant
  '[a-z0-9-]+\.(services\.ai|openai|cognitiveservices)\.azure\.com'   # a real Azure resource
  '[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z.]{2,}'          # e-mail addresses
  '(^|[^0-9a-fA-F])[0-9a-fA-F]{32}([^0-9a-fA-F]|$)'                  # 32-hex keys
  ".{0,14}$guid"                                            # GUIDs (tenant, site, list, drive IDs)
)
# Allowed: Microsoft's sample tenant, example domains, GitHub noreply, and n8n's own random
# node / webhook IDs (a GUID that is the whole value of an "id" or "webhookId" key).
# Allowed by exact value only, so a credential inside a registry URL (user:token@host) still fails.
allow="contoso\\.sharepoint\\.com|example\\.(com|org)|users\\.noreply\\.github\\.com|\"(id|webhookId)\": \"$guid\$"

for pat in "${generic[@]}"; do
  # -o: judge only the matched text, so an allowed value elsewhere on a long line can't hide a leak
  if hits=$(git grep "${scope[@]}" -noIE -e "$pat" -- . ':!scripts/check-leaks.sh' | grep -vE "$allow"); then
    echo "✗ looks like a secret or identifier ($pat):"; echo "$hits" | sed 's/^/    /'; found=1
  fi
done

# Lockfiles are skipped for the deny list only: they hold package names, versions and
# base64 integrity hashes, and short deny terms match random letters inside those hashes.
# The secret patterns above still scan them.
lockfiles=(':!**/package-lock.json' ':!**/yarn.lock' ':!**/pnpm-lock.yaml' ':!package-lock.json')
if [ -f "$deny" ]; then
  terms=$(grep -vE '^\s*(#|$)' "$deny" || true)
  if [ -z "$terms" ]; then
    echo "✗ private deny list at $deny has no entries — refusing"; found=1
  else
    # -o prints path:line:matched-text, so an exception covers exactly one term in one file.
    # Limitation: -o reports the leftmost-longest match, so inside an allowlisted file a deny
    # term that overlaps an allowed one on the same line can hide behind it.
    set +e
    raw=$(printf '%s\n' "$terms" | git grep "${scope[@]}" -noIiE -f /dev/stdin -- . "${lockfiles[@]}"); rc=$?
    set -e
    # git grep: 0 = matches, 1 = none, anything else (a bad pattern, say) must not read as clean
    if [ $rc -gt 1 ]; then
      echo "✗ deny-list scan failed (git grep exit $rc) — refusing"; found=1
    elif [ $rc -eq 0 ] && hits=$(printf '%s\n' "$raw" | awk -v list="$allowlist" '
        BEGIN { while ((getline l < list) > 0) if (l !~ /^[[:space:]]*(#|$)/) ok[tolower(l)] = 1 }
        { i = index($0, ":"); rest = substr($0, i + 1); j = index(rest, ":")
          if (!ok[tolower(substr($0, 1, i - 1) ":" substr(rest, j + 1))]) { print; n++ } }
        END { exit n ? 0 : 1 }'); then
      echo "✗ matches the private deny list:"; echo "$hits" | sed 's/^/    /'; found=1
    fi
  fi
elif [ "${ALLOW_NO_DENYLIST:-}" != "1" ]; then
  echo "✗ private deny list not found at $deny — refusing (set ALLOW_NO_DENYLIST=1 to skip it)"; found=1
fi

[ $found -eq 0 ] && echo "✓ no leaks found" || { echo; echo "Fix the lines above (or use placeholders) and try again."; exit 1; }
