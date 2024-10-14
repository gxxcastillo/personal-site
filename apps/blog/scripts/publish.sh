#!/bin/bash

if [ -f .env ]; then
  source .env
else
  echo ".env file not found!"
  exit 1
fi

cd "$NX_WORKSPACE_ROOT" || exit
echo "Current working directory: $PWD"

BUILD_PATH="${BUILD_PATH:-$NX_WORKSPACE_ROOT/dist/blog/.next}"

echo -e "\nBuilding all blog assets..."
pnpm nx build blog

echo -e "\nStripping .html file extensions"
find . -type f -name "*.html" | while read file; do mv "$file" "${file%.html}"; done

echo -e "\nSyncing html files to S3..."
aws s3 sync "$BUILD_PATH" "s3://$S3_BUCKET_NAME" --metadata-directive REPLACE --content-type "text/html" --exclude "*.*"

echo -e "\nSyncing non-html files to S3..."
aws s3 sync "$BUILD_PATH" "s3://$S3_BUCKET_NAME" --include "*.*"