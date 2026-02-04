#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Checking links in presentation..."

# Check if index.html exists
if [ ! -f "index.html" ]; then
  echo "❌ Error: index.html not found" >&2
  exit 1
fi

failed=0

# Extract URLs from index.html
urls=$(grep -hEo '(href|src)="[^"]+"' index.html | sed -E 's/^(href|src)="//;s/"$//' | sed 's/&amp;/&/g' | sort -u)

while IFS= read -r url; do
  # Skip empty lines
  [ -z "$url" ] && continue
  
  # Skip fragments and mailto links
  case "$url" in
    '#'* | 'mailto:'*)
      continue
      ;;
  esac

  # Skip external URLs (just check local files)
  if [[ "$url" =~ ^https?:// ]]; then
    continue
  fi

  # Handle local paths
  # Strip query parameters and fragments
  clean_url="${url%%\?*}"
  clean_url="${clean_url%%\#*}"
  
  if [[ "$clean_url" = /* ]]; then
    path="${PWD}${clean_url}"
  else
    path="${PWD}/${clean_url}"
  fi
  
  if [ -e "$path" ]; then
    echo "✓ OK: $url"
  else
    echo "✗ MISSING: $url -> $path"
    failed=1
  fi
done <<< "$urls"

if [ "$failed" -ne 0 ]; then
  echo ""
  echo "❌ Link check failed - broken links found" >&2
  exit 1
fi

echo ""
echo "✅ All links OK!"
exit 0
