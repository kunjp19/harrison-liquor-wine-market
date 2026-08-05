#!/usr/bin/env sh
set -eu

status=0

for file in index.html styles.css script.js data/*.json; do
  [ -f "$file" ] || continue
  case "$file" in
    *.json) python3 -m json.tool "$file" >/dev/null ;;
    *.js) node --check "$file" >/dev/null ;;
  esac
done

titles=$(grep -Eoh '<title>[^<]+' *.html | sed 's/^[^:]*:<title>//' | sort)
duplicate_titles=$(printf '%s\n' "$titles" | uniq -d)
if [ -n "$duplicate_titles" ]; then
  echo "Duplicate page titles:"
  echo "$duplicate_titles"
  status=1
fi

descriptions=$(grep -Eoh '<meta name="description" content="[^"]+' *.html | sed 's/^[^:]*:<meta name="description" content="//' | sort)
duplicate_descriptions=$(printf '%s\n' "$descriptions" | uniq -d)
if [ -n "$duplicate_descriptions" ]; then
  echo "Duplicate page descriptions:"
  echo "$duplicate_descriptions"
  status=1
fi

missing_assets=$(grep -Eoh 'assets/[^" )]+' *.html styles.css 2>/dev/null | sed 's/^[^:]*://' | sort -u | while read -r asset; do
  [ -f "$asset" ] || echo "$asset"
done)

if [ -n "$missing_assets" ]; then
  echo "Missing assets:"
  echo "$missing_assets"
  status=1
fi

oversized=$(find assets/photos/optimized -type f -size +600k -print 2>/dev/null || true)
if [ -n "$oversized" ]; then
  echo "Optimized images over 600 KB:"
  echo "$oversized"
  status=1
fi

missing_pages=$(grep -Eoh 'href="[^"#]+\.html' *.html | sed 's/^href="//' | grep -Ev '^https?://' | sort -u | while read -r page; do
  [ -f "$page" ] || echo "$page"
done)

if [ -n "$missing_pages" ]; then
  echo "Missing linked pages:"
  echo "$missing_pages"
  status=1
fi

exit "$status"
