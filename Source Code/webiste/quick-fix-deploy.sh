#!/bin/bash

set -e

BUCKET_NAME="outdrobe-website"
WEBSITE_DIR="/mnt/STORAGE/Projects/Javascript/Outdrobe/Source Code/webiste"

echo "🚀 Quick Fix: Redeploying with correct file structure..."
echo ""

cd "$WEBSITE_DIR"

echo "1️⃣ Rebuilding application..."
npm run build

echo ""
echo "2️⃣ Checking local build..."
if [ -f "dist/index.html" ] && [ -d "dist/assets" ]; then
    echo "✅ Local build looks good"
    echo "   Files in dist:"
    ls -la dist/
    echo "   Files in dist/assets:"
    ls -la dist/assets/
else
    echo "❌ Local build missing files"
    exit 1
fi

echo ""
echo "3️⃣ Clearing bucket and uploading fresh..."
# Clear the bucket first
gsutil -m rm -r gs://$BUCKET_NAME/** 2>/dev/null || echo "Bucket was empty"

# Upload everything
gsutil -m cp -r dist/* gs://$BUCKET_NAME/

echo ""
echo "4️⃣ Verifying deployment..."
echo "Checking bucket contents:"
gsutil ls -r gs://$BUCKET_NAME/

echo ""
echo "5️⃣ Setting proper permissions..."
gsutil -m acl ch -u AllUsers:R gs://$BUCKET_NAME/**

echo ""
echo "✅ Quick fix deployment complete!"
echo ""
echo "🌐 Test URLs:"
echo "   Main site: https://storage.googleapis.com/$BUCKET_NAME/index.html"
echo "   CSS file: https://storage.googleapis.com/$BUCKET_NAME/assets/index-DQ5Rub4r.css"
echo "   JS file: https://storage.googleapis.com/$BUCKET_NAME/assets/index-CD2h_cVj.js"