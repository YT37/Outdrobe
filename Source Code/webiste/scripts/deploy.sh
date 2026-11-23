#!/bin/bash

set -e

# Configuration
PROJECT_ID="outdrobe"
BUCKET_NAME="outdrobe-website"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(dirname "$SCRIPT_DIR")"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deploying Outdrobe Website to Google Cloud Storage...${NC}"

# Check if gsutil is available
if ! command -v gsutil &> /dev/null; then
    echo -e "${RED}❌ Error: gsutil not found${NC}"
    echo -e "${YELLOW}   Install Google Cloud SDK first${NC}"
    exit 1
fi

# Check if website directory exists
if [ ! -d "$WEBSITE_DIR" ]; then
    echo -e "${RED}❌ Error: Website directory not found: $WEBSITE_DIR${NC}"
    exit 1
fi

# Check if package.json exists
if [ ! -f "$WEBSITE_DIR/package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found in $WEBSITE_DIR${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "   Project ID: ${GREEN}$PROJECT_ID${NC}"
echo -e "   Bucket: ${GREEN}gs://$BUCKET_NAME${NC}"
echo -e "   Website Directory: ${GREEN}$WEBSITE_DIR${NC}"
echo ""

# Step 1: Navigate to website directory and build
echo -e "${BLUE}🏗️  Building React application...${NC}"
cd "$WEBSITE_DIR"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
fi

# Build the project
npm run build

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Error: dist folder not found${NC}"
    echo -e "${YELLOW}   Build may have failed${NC}"
    exit 1
fi

# Verify dist directory has content
if [ -z "$(ls -A dist)" ]; then
    echo -e "${RED}❌ Error: dist folder is empty${NC}"
    echo -e "${YELLOW}   Build may have failed${NC}"
    exit 1
fi

echo -e "${GREEN}   ✅ Build successful - dist folder contains $(ls dist | wc -l) items${NC}"

# Step 2: Upload to Cloud Storage
echo -e "${BLUE}📤 Uploading files to Cloud Storage...${NC}"

# Upload all files with proper cache headers (ensure trailing slash)
echo -e "${BLUE}   Uploading from: ${GREEN}$WEBSITE_DIR/dist/${NC}"
echo -e "${BLUE}   Local files to upload:${NC}"
find "$WEBSITE_DIR/dist" -type f | head -10

# Use rsync to upload with delete flag to remove old files
gsutil -m rsync -r -d "$WEBSITE_DIR/dist/" gs://$BUCKET_NAME/

# Verify upload
echo -e "${BLUE}   Verifying upload...${NC}"
echo -e "${BLUE}   Bucket contents after upload:${NC}"
gsutil ls -r gs://$BUCKET_NAME/ | head -10

# Step 3: Set proper content types and cache headers
echo -e "${BLUE}⚡ Setting cache headers and content types...${NC}"

# Set content types
gsutil -m setmeta -h "Content-Type:text/html" "gs://$BUCKET_NAME/**/*.html" 2>/dev/null || echo -e "${YELLOW}   Some HTML files may not exist${NC}"
gsutil -m setmeta -h "Content-Type:application/javascript" "gs://$BUCKET_NAME/**/*.js" 2>/dev/null || echo -e "${YELLOW}   Some JS files may not exist${NC}"
gsutil -m setmeta -h "Content-Type:text/css" "gs://$BUCKET_NAME/**/*.css" 2>/dev/null || echo -e "${YELLOW}   Some CSS files may not exist${NC}"

# Set cache control for static assets (long cache)
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" \
    "gs://$BUCKET_NAME/**/*.js" \
    "gs://$BUCKET_NAME/**/*.css" \
    "gs://$BUCKET_NAME/**/*.png" \
    "gs://$BUCKET_NAME/**/*.jpg" \
    "gs://$BUCKET_NAME/**/*.jpeg" \
    "gs://$BUCKET_NAME/**/*.gif" \
    "gs://$BUCKET_NAME/**/*.ico" \
    "gs://$BUCKET_NAME/**/*.svg" \
    "gs://$BUCKET_NAME/**/*.woff" \
    "gs://$BUCKET_NAME/**/*.woff2" \
    "gs://$BUCKET_NAME/**/*.ttf" 2>/dev/null || echo -e "${YELLOW}   Some static assets may not exist${NC}"

# Set cache control for HTML files (shorter cache)
gsutil -m setmeta -h "Cache-Control:public, max-age=300, must-revalidate" \
    "gs://$BUCKET_NAME/**/*.html" 2>/dev/null || echo -e "${YELLOW}   Some HTML files may not exist${NC}"

# Step 4: Invalidate CDN cache (if CDN is set up)
echo -e "${BLUE}🔄 Invalidating CDN cache...${NC}"
gcloud compute url-maps invalidate-cdn-cache $BUCKET_NAME-url-map \
    --path "/*" \
    --project=$PROJECT_ID \
    --quiet 2>/dev/null || echo -e "${YELLOW}   CDN cache invalidation skipped (may not be set up)${NC}"

# Step 5: Verify deployment
echo -e "${BLUE}🔍 Verifying deployment...${NC}"

# Check if index.html exists in bucket
if gsutil ls gs://$BUCKET_NAME/index.html >/dev/null 2>&1; then
    echo -e "${GREEN}   ✅ index.html found in bucket${NC}"
else
    echo -e "${RED}   ❌ index.html not found in bucket${NC}"
fi

# Step 6: Verify critical files are uploaded
echo -e "${BLUE}🔍 Verifying critical files...${NC}"
MISSING_FILES=0

if ! gsutil ls gs://$BUCKET_NAME/index.html >/dev/null 2>&1; then
    echo -e "${RED}   ❌ index.html missing${NC}"
    MISSING_FILES=$((MISSING_FILES + 1))
else
    echo -e "${GREEN}   ✅ index.html found${NC}"
fi

if ! gsutil ls gs://$BUCKET_NAME/assets/ >/dev/null 2>&1; then
    echo -e "${RED}   ❌ assets folder missing${NC}"
    MISSING_FILES=$((MISSING_FILES + 1))
else
    echo -e "${GREEN}   ✅ assets folder found${NC}"
    
    # Check specific asset files
    if ! gsutil ls gs://$BUCKET_NAME/assets/index-*.css >/dev/null 2>&1; then
        echo -e "${YELLOW}   ⚠️  CSS file may be missing${NC}"
    else
        echo -e "${GREEN}   ✅ CSS file found${NC}"
    fi
    
    if ! gsutil ls gs://$BUCKET_NAME/assets/index-*.js >/dev/null 2>&1; then
        echo -e "${YELLOW}   ⚠️  JS file may be missing${NC}"
    else
        echo -e "${GREEN}   ✅ JS file found${NC}"
    fi
fi

if [ $MISSING_FILES -gt 0 ]; then
    echo -e "${RED}⚠️  $MISSING_FILES critical files missing - deployment may have issues${NC}"
else
    echo -e "${GREEN}✅ All critical files verified${NC}"
fi

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}📍 Website URLs:${NC}"
echo -e "   Direct: ${GREEN}https://storage.googleapis.com/$BUCKET_NAME/index.html${NC}"

# Check if custom domain is set up
IP_ADDRESS=$(gcloud compute addresses describe $BUCKET_NAME-ip \
    --global \
    --project=$PROJECT_ID \
    --format="value(address)" 2>/dev/null || echo "")

if [ ! -z "$IP_ADDRESS" ]; then
    echo -e "   Custom Domain: ${GREEN}https://outdrobe.tech${NC} (after DNS setup)"
    echo -e "   CDN IP: ${GREEN}$IP_ADDRESS${NC}"
fi

echo ""
echo -e "${BLUE}📊 Deployment Stats:${NC}"
FILE_COUNT=$(gsutil ls -r gs://$BUCKET_NAME/ | wc -l)
TOTAL_SIZE=$(gsutil du -s gs://$BUCKET_NAME/ | awk '{print $1}')
echo -e "   Files uploaded: ${GREEN}$((FILE_COUNT - 1))${NC}"
echo -e "   Total size: ${GREEN}$(echo $TOTAL_SIZE | numfmt --to=iec)B${NC}"

echo ""
echo -e "${GREEN}🎉 Website deployment complete!${NC}"
echo -e "${YELLOW}💡 Test your website at: https://storage.googleapis.com/$BUCKET_NAME/index.html${NC}"