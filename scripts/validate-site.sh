#!/usr/bin/env sh
set -eu

status=0

for file in index.html styles.css script.js api-enhancements.js local-trends.js review-tools.js data/*.json; do
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

if ! python3 - <<'PY'
from pathlib import Path
import re
from collections import defaultdict

try:
    from PIL import Image
except Exception as exc:
    raise SystemExit(f"Unable to import Pillow for image similarity audit: {exc}")

public_files = [
    *Path(".").glob("*.html"),
    *Path("data").glob("*.json"),
]
public_files = [
    path for path in public_files
    if path.name not in {"asset-approval.html", "health.html"}
]

used = defaultdict(list)
missing = []

for path in public_files:
    text = path.read_text()
    html_images = re.findall(r'<img[^>]+src="([^"]+)"', text)
    json_images = re.findall(r'"image"\s*:\s*"([^"]+)"', text)
    for src in html_images + json_images:
        src = src.split("?", 1)[0]
        if not src.startswith("assets/photos/"):
            continue
        if src.endswith("harrison-logo.jpg"):
            continue
        if path.name == "index.html" and src.endswith("store-counter-hero-1200.webp"):
            continue
        used[src].append(str(path))
        if not Path(src).exists():
            missing.append((str(path), src))

duplicates = {src: paths for src, paths in used.items() if len(paths) > 1}

def dhash(src, size=9):
    image = Image.open(src).convert("L").resize((size, size - 1))
    pixels = list(image.getdata())
    bits = []
    for y in range(size - 1):
        row = pixels[y * size:(y + 1) * size]
        for x in range(size - 1):
            bits.append(row[x] > row[x + 1])
    return bits

def distance(left, right):
    return sum(a != b for a, b in zip(left, right))

image_paths = sorted(src for src in used if src.startswith("assets/photos/final-webp/") and Path(src).exists())
hashes = {src: dhash(src) for src in image_paths}
near_duplicates = []

for index, src in enumerate(image_paths):
    for other in image_paths[index + 1:]:
        score = distance(hashes[src], hashes[other])
        if score <= 9:
            near_duplicates.append((score, src, other))

if missing:
    print("Missing public image references:")
    for page, src in missing:
        print(f"  {page}: {src}")

if duplicates:
    print("Repeated public section/card image references:")
    for src, paths in sorted(duplicates.items()):
        print(f"  {src}: {', '.join(paths)}")

if near_duplicates:
    print("Near-duplicate public section/card images:")
    for score, src, other in near_duplicates:
        print(f"  score {score}: {src} <-> {other}")

raise SystemExit(1 if missing or duplicates or near_duplicates else 0)
PY
then
  status=1
fi

exit "$status"
