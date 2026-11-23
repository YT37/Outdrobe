#!/bin/bash

set -e

BUCKET_NAME="outdrobe-website"

echo "🔍 Checking GCS bucket contents..."
echo ""

echo "1️⃣ Current bucket contents:"
gsutil ls -r gs://$BUCKET_NAME/ || echo "   Bucket appears to be empty or inaccessible"
echo ""

echo "2️⃣ Checking for specific files:"
echo "   Looking for index.html..."
gsutil ls gs://$BUCKET_NAME/index.html 2>/dev/null && echo "   ✅ index.html found" || echo "   ❌ index.html not found"

echo "   Looking for assets folder..."
gsutil ls gs://$BUCKET_NAME/assets/ 2>/dev/null && echo "   ✅ assets folder found" || echo "   ❌ assets folder not found"

echo "   Looking for CSS file..."
gsutil ls gs://$BUCKET_NAME/assets/index-DQ5Rub4r.css 2>/dev/null && echo "   ✅ CSS file found" || echo "   ❌ CSS file not found"

echo "   Looking for JS file..."
gsutil ls gs://$BUCKET_NAME/assets/index-CD2h_cVj.js 2>/dev/null && echo "   ✅ JS file found" || echo "   ❌ JS file not found"

echo ""
echo "3️⃣ Testing direct file access:"
echo "   Index URL: https://storage.googleapis.com/$BUCKET_NAME/index.html"
echo "   CSS URL: https://storage.googleapis.com/$BUCKET_NAME/assets/index-DQ5Rub4r.css"
echo "   JS URL: https://storage.googleapis.com/$BUCKET_NAME/assets/index-CD2h_cVj.js"

echo ""
echo "🔧 If files are missing, we'll redeploy..."
if ! gsutil ls gs://$BUCKET_NAME/assets/ >/dev/null 2>&1; then
    echo "   Assets missing - running deployment..."
    ./deploy.sh
else
    echo "   ✅ Files appear to be deployed correctly"
fi