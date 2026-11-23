#!/bin/bash

set -e

# Configuration
PROJECT_ID="outdrobe"
VM_NAME="outdrobe-server"
ZONE="us-east1-c"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ACTION=${1:-status}

case $ACTION in
    "start")
        echo -e "${BLUE}🚀 Starting VM...${NC}"
        gcloud compute instances start $VM_NAME --zone=$ZONE --project=$PROJECT_ID
        echo -e "${GREEN}✅ VM started${NC}"
        ;;
        
    "stop")
        echo -e "${BLUE}🛑 Stopping VM...${NC}"
        gcloud compute instances stop $VM_NAME --zone=$ZONE --project=$PROJECT_ID
        echo -e "${GREEN}✅ VM stopped${NC}"
        ;;
        
    "restart")
        echo -e "${BLUE}🔄 Restarting VM...${NC}"
        gcloud compute instances stop $VM_NAME --zone=$ZONE --project=$PROJECT_ID
        sleep 10
        gcloud compute instances start $VM_NAME --zone=$ZONE --project=$PROJECT_ID
        echo -e "${GREEN}✅ VM restarted${NC}"
        ;;
        
    "logs")
        echo -e "${BLUE}📋 Fetching application logs...${NC}"
        gcloud compute ssh $VM_NAME --zone=$ZONE --project=$PROJECT_ID --command="sudo docker logs outdrobe-server-container --tail=50"
        ;;
        
    "ssh")
        echo -e "${BLUE}🔗 Connecting to VM...${NC}"
        gcloud compute ssh $VM_NAME --zone=$ZONE --project=$PROJECT_ID
        ;;
        
    "status")
        echo -e "${BLUE}📊 VM Status:${NC}"
        STATUS=$(gcloud compute instances describe $VM_NAME --zone=$ZONE --format="get(status)" --project=$PROJECT_ID 2>/dev/null || echo "NOT_FOUND")
        
        if [ "$STATUS" = "RUNNING" ]; then
            IP=$(gcloud compute instances describe $VM_NAME --zone=$ZONE --format="get(networkInterfaces[0].accessConfigs[0].natIP)" --project=$PROJECT_ID)
            echo -e "   Status: ${GREEN}RUNNING${NC}"
            echo -e "   IP: ${GREEN}$IP${NC}"
            echo -e "   API: ${GREEN}http://$IP:8080${NC}"
            echo ""
            echo -e "${BLUE}🔍 Testing health endpoint...${NC}"
            if curl -s -f "http://$IP:8080/health" >/dev/null; then
                echo -e "   Health: ${GREEN}✅ OK${NC}"
            else
                echo -e "   Health: ${RED}❌ Failed${NC}"
            fi
            
            echo -e "${BLUE}🎮 GPU Status:${NC}"
            gcloud compute ssh $VM_NAME --zone=$ZONE --project=$PROJECT_ID --command="nvidia-smi --query-gpu=name,utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits 2>/dev/null || echo 'GPU info not available'" 2>/dev/null | head -1 | while IFS=, read name util mem_used mem_total; do
                if [ "$name" != "GPU info not available" ]; then
                    echo -e "   GPU: ${GREEN}$name${NC}"
                    echo -e "   Utilization: ${GREEN}${util}%${NC}"
                    echo -e "   Memory: ${GREEN}${mem_used}MB / ${mem_total}MB${NC}"
                else
                    echo -e "   ${YELLOW}GPU info not available${NC}"
                fi
            done
        elif [ "$STATUS" = "TERMINATED" ]; then
            echo -e "   Status: ${YELLOW}STOPPED${NC}"
        elif [ "$STATUS" = "NOT_FOUND" ]; then
            echo -e "   Status: ${RED}NOT_FOUND${NC}"
            echo -e "${YELLOW}   Run ./deploy.sh to create the VM${NC}"
        else
            echo -e "   Status: ${YELLOW}$STATUS${NC}"
        fi
        ;;
        
    "update")
        echo -e "${BLUE}🔄 Updating application on VM...${NC}"
        # Copy current directory to VM
        gcloud compute scp --recurse . $VM_NAME:/tmp/outdrobe-server-update --zone=$ZONE --project=$PROJECT_ID
        
        # Update and restart container
        gcloud compute ssh $VM_NAME --zone=$ZONE --project=$PROJECT_ID --command="
            sudo cp -r /tmp/outdrobe-server-update/* /opt/outdrobe-server/
            cd /opt/outdrobe-server
            sudo docker build -t outdrobe-server .
            sudo docker stop outdrobe-server-container
            sudo docker rm outdrobe-server-container
            sudo docker run -d --name outdrobe-server-container --gpus all -p 8080:8080 --restart unless-stopped outdrobe-server
            rm -rf /tmp/outdrobe-server-update
            echo 'Application updated successfully with GPU support'
        "
        echo -e "${GREEN}✅ Application updated${NC}"
        ;;
        
    *)
        echo -e "${RED}❌ Unknown action: $ACTION${NC}"
        echo ""
        echo -e "${BLUE}Usage: ./vm-manage.sh [action]${NC}"
        echo ""
        echo -e "${BLUE}Available actions:${NC}"
        echo -e "   ${GREEN}start${NC}    - Start the VM"
        echo -e "   ${GREEN}stop${NC}     - Stop the VM"
        echo -e "   ${GREEN}restart${NC}  - Restart the VM"
        echo -e "   ${GREEN}logs${NC}     - View application logs"
        echo -e "   ${GREEN}ssh${NC}      - SSH into the VM"
        echo -e "   ${GREEN}status${NC}   - Check VM and application status"
        echo -e "   ${GREEN}update${NC}   - Update application code"
        exit 1
        ;;
esac