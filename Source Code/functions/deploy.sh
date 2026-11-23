#!/bin/bash

set -e

# Configuration
PROJECT_ID="outdrobe"
PROJECT_NAME="outdrobe-functions"
SERVICE_NAME="outdrobe-functions"
SA_NAME="outdrobe-run-sa"
REGION="us-central1"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deploying $PROJECT_NAME to Google Cloud Run...${NC}"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: gcloud CLI not found${NC}"
    echo -e "${YELLOW}   Install from: https://cloud.google.com/sdk/docs/install${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Using configuration:${NC}"
echo -e "   Project ID: ${GREEN}$PROJECT_ID${NC}"
echo -e "   Service Name: ${GREEN}$SERVICE_NAME${NC}"
echo -e "   Region: ${GREEN}$REGION${NC}"
echo ""

# Step 1: Create service account if it doesn't exist
echo -e "${BLUE}👤 Setting up service account...${NC}"
SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

if ! gcloud iam service-accounts describe $SA_EMAIL --project=$PROJECT_ID &>/dev/null; then
    echo -e "${YELLOW}   Creating service account: $SA_NAME${NC}"
    gcloud iam service-accounts create $SA_NAME \
        --description="Cloud Run service account for Outdrobe functions" \
        --display-name="outdrobe-run-sa" \
        --project=$PROJECT_ID
else
    echo -e "${GREEN}   ✅ Service account already exists${NC}"
fi

# Step 2: Grant Secret Manager access
echo -e "${BLUE}🔐 Granting Secret Manager access...${NC}"
gcloud secrets add-iam-policy-binding KIBANA_API_KEY \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/secretmanager.secretAccessor" \
    --project=$PROJECT_ID \
    --quiet || echo -e "${YELLOW}   Note: KIBANA_API_KEY binding may already exist${NC}"

gcloud secrets add-iam-policy-binding FISH_API_KEY \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/secretmanager.secretAccessor" \
    --project=$PROJECT_ID \
    --quiet || echo -e "${YELLOW}   Note: FISH_API_KEY binding may already exist${NC}"

# Step 3: Build and push image
echo -e "${BLUE}🏗️  Building and pushing image...${NC}"
gcloud builds submit --tag gcr.io/$PROJECT_ID/$PROJECT_NAME --project=$PROJECT_ID

# Step 4: Deploy to Cloud Run with secrets
echo -e "${BLUE}🚀 Deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$PROJECT_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --service-account $SA_EMAIL \
    --set-secrets "KIBANA_API_KEY=KIBANA_API_KEY:latest","FISH_API_KEY=FISH_API_KEY:latest" \
    --memory 1Gi \
    --cpu 1 \
    --max-instances 10 \
    --timeout 300 \
    --concurrency 80 \
    --project=$PROJECT_ID

# Step 5: Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --format="value(status.url)" \
    --project=$PROJECT_ID)

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo -e "${BLUE}📍 Service Details:${NC}"
echo -e "   URL: ${GREEN}$SERVICE_URL${NC}"
echo -e ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"