#!/usr/bin/env bash
# Test to ensure index.html has exactly one main landmark element
# This prevents regression of the accessibility issue where main landmark was missing

set -e

echo "🔍 Checking for main landmark in index.html..."

# Check if main element exists
if ! grep -q "<main>" index.html; then
  echo "❌ FAIL: No <main> element found in index.html"
  exit 1
fi

# Count the number of main elements
MAIN_COUNT=$(grep -c "<main>" index.html || true)

if [ "$MAIN_COUNT" -eq 0 ]; then
  echo "❌ FAIL: No <main> element found"
  exit 1
elif [ "$MAIN_COUNT" -gt 1 ]; then
  echo "❌ FAIL: Multiple <main> elements found ($MAIN_COUNT)"
  exit 1
else
  echo "✅ PASS: Exactly one <main> landmark found"
fi

# Verify closing tag exists
if ! grep -q "</main>" index.html; then
  echo "❌ FAIL: No </main> closing tag found"
  exit 1
fi

echo "✅ Main landmark test passed!"
