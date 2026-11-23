#!/bin/bash

set -e

# Configuration
PROJECT_ID="outdrobe"
BUCKET_NAME="outdrobe-website"
DOMAIN="outdrobe.tech"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}☁️  Setting up Google Cloud Storage + CDN for Outdrobe Website...${NC}"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: gcloud CLI not found${NC}"
    echo -e "${YELLOW}   Install from: https://cloud.google.com/sdk/docs/install${NC}"
    exit 1
fi


echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "   Project ID: ${GREEN}$PROJECT_ID${NC}"
echo -e "   Bucket Name: ${GREEN}$BUCKET_NAME${NC}"
echo -e "   Domain: ${GREEN}$DOMAIN${NC}"
echo ""

# Step 1: Create Cloud Storage bucket
echo -e "${BLUE}🪣 Creating Cloud Storage bucket...${NC}"
if ! gsutil ls -b gs://$BUCKET_NAME >/dev/null 2>&1; then
    gsutil mb -p $PROJECT_ID -c STANDARD -l US gs://$BUCKET_NAME/
    echo -e "${GREEN}   ✅ Bucket created: gs://$BUCKET_NAME${NC}"
else
    echo -e "${YELLOW}   ⚠️  Bucket already exists: gs://$BUCKET_NAME${NC}"
fi

# Step 2: Configure bucket for website hosting
echo -e "${BLUE}🌐 Configuring bucket for website hosting...${NC}"
gsutil web set -m index.html -e index.html gs://$BUCKET_NAME/

# Step 3: Make bucket publicly readable
echo -e "${BLUE}🔓 Making bucket publicly readable...${NC}"
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME/

# Step 4: Set CORS policy for the bucket
echo -e "${BLUE}🔧 Setting CORS policy...${NC}"
echo '[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "OPTIONS"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin", "Access-Control-Allow-Methods"],
    "maxAgeSeconds": 3600
  }
]' > /tmp/cors.json

gsutil cors set /tmp/cors.json gs://$BUCKET_NAME/
rm /tmp/cors.json

# Step 5: Reserve static IP
echo -e "${BLUE}🌍 Reserving static IP address...${NC}"
gcloud compute addresses create $BUCKET_NAME-ip \
    --global \
    --project=$PROJECT_ID \
    --quiet || echo -e "${YELLOW}   IP address may already exist${NC}"

# Step 6: Create Load Balancer and CDN
echo -e "${BLUE}⚖️  Creating Load Balancer and CDN...${NC}"

# Create backend bucket
gcloud compute backend-buckets create $BUCKET_NAME-backend \
    --gcs-bucket-name=$BUCKET_NAME \
    --project=$PROJECT_ID \
    --quiet || echo -e "${YELLOW}   Backend bucket may already exist${NC}"

# Create URL map
gcloud compute url-maps create $BUCKET_NAME-url-map \
    --default-backend-bucket=$BUCKET_NAME-backend \
    --project=$PROJECT_ID \
    --quiet || echo -e "${YELLOW}   URL map may already exist${NC}"

# Create SSL certificate for custom domain
gcloud compute ssl-certificates create $BUCKET_NAME-ssl-cert \
    --domains=$DOMAIN \
    --global \
    --project=$PROJECT_ID \
    --quiet || echo -e "${YELLOW}   SSL certificate may already exist${NC}"

# Create HTTPS proxy
gcloud compute target-https-proxies create $BUCKET_NAME-https-proxy \
    --url-map=$BUCKET_NAME-url-map \
    --ssl-certificates=$BUCKET_NAME-ssl-cert \
    --project=$PROJECT_ID \
    --quiet || echo -e "${YELLOW}   HTTPS proxy may already exist${NC}"

# Create global forwarding rule
gcloud compute forwarding-rules create $BUCKET_NAME-https-forwarding-rule \
    --address=$BUCKET_NAME-ip \
    --global \
    --target-https-proxy=$BUCKET_NAME-https-proxy \
    --ports=443 \
    --project=$PROJECT_ID \
    --quiet || echo -e "${YELLOW}   Forwarding rule may already exist${NC}"

# Get the IP address
IP_ADDRESS=$(gcloud compute addresses describe $BUCKET_NAME-ip \
    --global \
    --project=$PROJECT_ID \
    --format="value(address)")

echo -e "${GREEN}✅ Cloud Storage + CDN setup complete!${NC}"
