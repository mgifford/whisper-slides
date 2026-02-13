#!/usr/bin/env bash
# Test to ensure index.html has exactly one main landmark element
# This prevents regression of the accessibility issue where main landmark was missing

set -e

echo "🔍 Checking for main landmark in index.html..."

# Count the number of opening main tags
MAIN_OPEN_COUNT=$(grep -c "<main>" index.html || true)

# Count the number of closing main tags
MAIN_CLOSE_COUNT=$(grep -c "</main>" index.html || true)

if [ "$MAIN_OPEN_COUNT" -eq 0 ]; then
  echo "❌ FAIL: No <main> element found in index.html"
  exit 1
elif [ "$MAIN_OPEN_COUNT" -gt 1 ]; then
  echo "❌ FAIL: Multiple <main> opening tags found ($MAIN_OPEN_COUNT)"
  exit 1
fi

if [ "$MAIN_CLOSE_COUNT" -eq 0 ]; then
  echo "❌ FAIL: No </main> closing tag found in index.html"
  exit 1
elif [ "$MAIN_CLOSE_COUNT" -gt 1 ]; then
  echo "❌ FAIL: Multiple </main> closing tags found ($MAIN_CLOSE_COUNT)"
  exit 1
fi

if [ "$MAIN_OPEN_COUNT" -ne "$MAIN_CLOSE_COUNT" ]; then
  echo "❌ FAIL: Mismatched <main> tags (opening: $MAIN_OPEN_COUNT, closing: $MAIN_CLOSE_COUNT)"
  exit 1
fi

echo "✅ PASS: Exactly one <main> landmark found with matching opening and closing tags"
echo "✅ Main landmark test passed!"
