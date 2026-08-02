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

exit "$status"
