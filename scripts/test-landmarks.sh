#!/usr/bin/env bash
# Test that progress and clock elements are contained in landmark regions
# This prevents regression of the accessibility issue where these elements
# were not contained by landmarks.

set -e

echo "🔍 Testing landmark accessibility..."

# Check if progress and clock elements use <aside> tag or have role="complementary"
if ! grep -q '<aside class="progress"' index.html; then
  echo "❌ FAIL: .progress element is not using <aside> tag"
  exit 1
fi

if ! grep -q '<aside class="clock"' index.html; then
  echo "❌ FAIL: .clock element is not using <aside> tag"
  exit 1
fi

# Check if progress has aria-label
if ! grep -q 'class="progress".*aria-label' index.html; then
  echo "❌ FAIL: .progress element is missing aria-label attribute"
  exit 1
fi

# Check if clock has aria-label
if ! grep -q 'class="clock".*aria-label' index.html; then
  echo "❌ FAIL: .clock element is missing aria-label attribute"
  exit 1
fi

echo "✓ All landmark tests passed"
echo "  - .progress is an <aside> element with aria-label"
echo "  - .clock is an <aside> element with aria-label"
