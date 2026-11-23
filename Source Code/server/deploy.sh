#!/bin/bash

set -e

# Configuration
PROJECT_ID="outdrobe"
VM_NAME="outdrobe-server"
ZONE="us-east1-c"
MACHINE_TYPE="n1-standard-4"
IMAGE_FAMILY="ubuntu-2204-lts"
IMAGE_PROJECT="ubuntu-os-cloud"
GPU_TYPE="nvidia-tesla-t4"
GPU_COUNT="1"
BOOT_DISK_SIZE="200GB"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deploying $VM_NAME to Google Compute Engine VM...${NC}"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: gcloud CLI not found${NC}"
    echo -e "${YELLOW}   Install from: https://cloud.google.com/sdk/docs/install${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Using configuration:${NC}"
echo -e "   Project ID: ${GREEN}$PROJECT_ID${NC}"
echo -e "   VM Name: ${GREEN}$VM_NAME${NC}"
echo -e "   Zone: ${GREEN}$ZONE${NC}"
echo -e "   Machine Type: ${GREEN}$MACHINE_TYPE${NC}"
echo ""

# Function to check if VM exists
vm_exists() {
    gcloud compute instances describe $VM_NAME --zone=$ZONE --project=$PROJECT_ID &>/dev/null
}

# Step 1: Create VM if it doesn't exist
if vm_exists; then
    echo -e "${GREEN}✅ VM $VM_NAME already exists${NC}"
    VM_ACTION="update"
else
    echo -e "${BLUE}�️  Creating Compute Engine VM...${NC}"
    VM_ACTION="create"
    
    # Create startup script
    cat > startup.sh << 'EOF'
#!/bin/bash
# Update system
apt-get update
apt-get upgrade -y

# Install NVIDIA drivers and CUDA
apt-get install -y ubuntu-drivers-common
ubuntu-drivers autoinstall

# Install CUDA (required for GPU acceleration)
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.0-1_all.deb
dpkg -i cuda-keyring_1.0-1_all.deb
apt-get update
apt-get -y install cuda-toolkit-12-2

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install NVIDIA Docker runtime
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | tee /etc/apt/sources.list.d/nvidia-docker.list
apt-get update
apt-get install -y nvidia-docker2
systemctl restart docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create app directory
mkdir -p /opt/outdrobe-server
chown $USER:$USER /opt/outdrobe-server

# Add user to docker group
usermod -aG docker $USER

echo "VM setup with GPU support complete" > /var/log/startup-script.log
EOF

    gcloud compute instances create $VM_NAME \
        --zone=$ZONE \
        --machine-type=$MACHINE_TYPE \
        --image-family=$IMAGE_FAMILY \
        --image-project=$IMAGE_PROJECT \
        --boot-disk-size=$BOOT_DISK_SIZE \
        --boot-disk-type=pd-ssd \
        --accelerator=type=$GPU_TYPE,count=$GPU_COUNT \
        --maintenance-policy=TERMINATE \
        --restart-on-failure \
        --tags=http-server,https-server \
        --metadata-from-file startup-script=startup.sh \
        --project=$PROJECT_ID
    
    # Create firewall rule for the AI server
    gcloud compute firewall-rules create allow-server \
        --allow tcp:8080 \
        --source-ranges 0.0.0.0/0 \
        --target-tags http-server \
        --project=$PROJECT_ID || echo -e "${YELLOW}   Firewall rule may already exist${NC}"
    
    echo -e "${GREEN}✅ VM created successfully${NC}"
    echo -e "${YELLOW}⏳ Waiting for VM to be ready (30 seconds)...${NC}"
    sleep 30
fi

# Step 2: Deploy application to VM
echo -e "${BLUE}📦 Deploying application to VM...${NC}"

# Copy files to VM
echo -e "${YELLOW}   Copying application files...${NC}"
gcloud compute scp --recurse . $VM_NAME:/tmp/outdrobe-server --zone=$ZONE --project=$PROJECT_ID

# Run deployment commands on VM
echo -e "${YELLOW}   Setting up application on VM...${NC}"
gcloud compute ssh $VM_NAME --zone=$ZONE --project=$PROJECT_ID --command="
    sudo cp -r /tmp/outdrobe-server/* /opt/outdrobe-server/
    cd /opt/outdrobe-server
    sudo docker build -t outdrobe-server .
    sudo docker stop outdrobe-server-container 2>/dev/null || true
    sudo docker rm outdrobe-server-container 2>/dev/null || true
    sudo docker run -d --name outdrobe-server-container --gpus all -p 8080:8080 --restart unless-stopped outdrobe-server
    echo 'Application deployed successfully with GPU support'
"

# Step 3: Get VM external IP
VM_IP=$(gcloud compute instances describe $VM_NAME \
    --zone=$ZONE \
    --format="get(networkInterfaces[0].accessConfigs[0].natIP)" \
    --project=$PROJECT_ID)

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo -e "${BLUE}📍 VM Details:${NC}"
echo -e "   VM Name: ${GREEN}$VM_NAME${NC}"
echo -e "   URL: ${GREEN}http://$VM_IP:8080${NC}"
echo ""
echo -e "${GREEN}🎉 Server VM deployment complete!${NC}"

# Cleanup
rm -f startup.sh