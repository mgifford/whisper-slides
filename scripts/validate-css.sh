#!/usr/bin/env bash
# Simple CSS validation - checks for common errors
set -euo pipefail

echo "🎨 Validating CSS files..."

failed=0
css_files=$(find slides -name "*.css" -type f)

for file in $css_files; do
  echo "Checking $file..."
  
  # Check for unclosed braces
  open_braces=$(grep -o '{' "$file" | wc -l)
  close_braces=$(grep -o '}' "$file" | wc -l)
  
  if [ "$open_braces" -ne "$close_braces" ]; then
    echo "  ✗ Mismatched braces in $file (open: $open_braces, close: $close_braces)"
    failed=1
  else
    echo "  ✓ Braces balanced"
  fi
  
  # Check for common typos
  if grep -q ';;' "$file"; then
    echo "  ⚠ Double semicolons found in $file"
  fi
  
  # Check for trailing whitespace (informational only)
  if grep -q '[[:space:]]$' "$file"; then
    echo "  ℹ Trailing whitespace found in $file"
  fi
done

if [ "$failed" -ne 0 ]; then
  echo ""
  echo "❌ CSS validation failed"
  exit 1
fi

echo ""
echo "✅ CSS validation passed!"
exit 0
