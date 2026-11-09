#!/bin/sh
# Upload source maps to GlitchTip using the chunk-upload + assemble API.
# This replaces sentry-cli with plain curl calls.
#
# Required env vars:
#   SENTRY_URL        - GlitchTip base URL (e.g. https://app.glitchtip.com)
#   SENTRY_ORG        - Organization slug
#   SENTRY_PROJECT    - Project slug
#   SENTRY_AUTH_TOKEN - Auth token with project:releases permission
#   VERSION           - Release version string (e.g. glitchtip@3.0.0)
#
# Usage: ./scripts/upload-sourcemaps.sh <build-dir>
#   e.g.: ./scripts/upload-sourcemaps.sh dist/glitchtip-frontend/browser

set -eu

BUILD_DIR="${1:?Usage: $0 <build-dir>}"
API_BASE="${SENTRY_URL}/api/0"

# Verify required env vars
for var in SENTRY_URL SENTRY_ORG SENTRY_PROJECT SENTRY_AUTH_TOKEN VERSION; do
  eval val=\$$var
  if [ -z "$val" ]; then
    echo "Error: $var is not set" >&2
    exit 1
  fi
done

WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

echo "==> Collecting source maps from ${BUILD_DIR}"

# Find .js files that have a corresponding .map file, and standalone .css.map files
MANIFEST_FILES=""
FILE_COUNT=0

for map_file in "$BUILD_DIR"/*.map; do
  [ -f "$map_file" ] || continue
  basename=$(basename "$map_file")

  # Determine the artifact URL (with ~/ prefix convention)
  artifact_url="~/static/${basename}"

  # Determine if this is a js.map or css.map
  if echo "$basename" | grep -q '\.js\.map$'; then
    js_basename="${basename%.map}"
    js_file="$BUILD_DIR/$js_basename"

    # Copy the .map file into the bundle
    mkdir -p "$WORK_DIR/files/_/_"
    cp "$map_file" "$WORK_DIR/files/_/_/$basename"

    # Add the .map entry to manifest
    MANIFEST_FILES="${MANIFEST_FILES}$(printf '    "files/_/_/%s": {"type": "source_map", "url": "~/static/%s", "headers": {}}' "$basename" "$basename"),"

    # If the .js file exists, include it too and link them
    if [ -f "$js_file" ]; then
      cp "$js_file" "$WORK_DIR/files/_/_/$js_basename"
      MANIFEST_FILES="${MANIFEST_FILES}$(printf '    "files/_/_/%s": {"type": "minified_source", "url": "~/static/%s", "headers": {"sourcemap": "%s"}}' "$js_basename" "$js_basename" "$basename"),"
      FILE_COUNT=$((FILE_COUNT + 2))
    else
      FILE_COUNT=$((FILE_COUNT + 1))
    fi
  elif echo "$basename" | grep -q '\.css\.map$'; then
    # CSS source maps - include but don't pair
    mkdir -p "$WORK_DIR/files/_/_"
    cp "$map_file" "$WORK_DIR/files/_/_/$basename"
    MANIFEST_FILES="${MANIFEST_FILES}$(printf '    "files/_/_/%s": {"type": "source_map", "url": "~/static/%s", "headers": {}}' "$basename" "$basename"),"
    FILE_COUNT=$((FILE_COUNT + 1))
  fi
done

if [ "$FILE_COUNT" -eq 0 ]; then
  echo "No source map files found in ${BUILD_DIR}"
  exit 0
fi

echo "==> Found ${FILE_COUNT} files to upload"

# Remove trailing comma and build manifest JSON
MANIFEST_FILES=$(echo "$MANIFEST_FILES" | sed 's/,$//')

cat > "$WORK_DIR/manifest.json" <<MANIFEST_EOF
{
  "files": {
${MANIFEST_FILES}
  },
  "release": "${VERSION}",
  "org": "${SENTRY_ORG}",
  "project": "${SENTRY_PROJECT}"
}
MANIFEST_EOF

echo "==> Creating artifact bundle zip"
BUNDLE_ZIP="$WORK_DIR/bundle.zip"
(cd "$WORK_DIR" && zip -r bundle.zip manifest.json files/)

# Calculate SHA1 checksum of the zip (before gzip)
CHECKSUM=$(sha1sum "$BUNDLE_ZIP" | cut -d' ' -f1)
echo "==> Bundle checksum: ${CHECKSUM}"

# Gzip the zip for upload
gzip -c "$BUNDLE_ZIP" > "$WORK_DIR/${CHECKSUM}.gz"

echo "==> Uploading chunk to ${API_BASE}/organizations/${SENTRY_ORG}/chunk-upload/"
curl --fail-with-body --silent --show-error -X POST \
  "${API_BASE}/organizations/${SENTRY_ORG}/chunk-upload/" \
  -H "Authorization: Bearer ${SENTRY_AUTH_TOKEN}" \
  -F "file_gzip=@${WORK_DIR}/${CHECKSUM}.gz;filename=${CHECKSUM}"

echo ""
echo "==> Assembling artifact bundle"
curl --fail-with-body --silent --show-error -X POST \
  "${API_BASE}/organizations/${SENTRY_ORG}/artifactbundle/assemble/" \
  -H "Authorization: Bearer ${SENTRY_AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"checksum\":\"${CHECKSUM}\",\"chunks\":[\"${CHECKSUM}\"],\"projects\":[\"${SENTRY_PROJECT}\"],\"version\":\"${VERSION}\"}"

echo ""
echo "==> Done! Uploaded ${FILE_COUNT} files for release ${VERSION}"
