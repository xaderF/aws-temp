#!/usr/bin/env bash
set -euo pipefail
export AWS_PAGER=""

STACK_NAME="${STACK_NAME:-utransit-backend}"
RDS_STACK_NAME="${RDS_STACK_NAME:-utransit-rds}"
REGION="${AWS_REGION:-us-west-2}"
PROJECT_NAME="${PROJECT_NAME:-utransit}"
DATABASE_URL="${DATABASE_URL:-}"
JWT_SECRET="${JWT_SECRET:-change-me-in-production}"
CORS_ORIGINS="${CORS_ORIGINS:-http://localhost:5173,http://localhost:8080,https://*.amazonaws.com,https://*.cloudfront.net}"

if ! command -v aws >/dev/null 2>&1; then
  echo "AWS CLI required. Install and run 'aws configure'."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker required for building the image."
  exit 1
fi

if [[ -z "${DATABASE_URL}" ]]; then
  echo "Set DATABASE_URL before running."
  echo "Example: DATABASE_URL='postgresql://user:pass@host:5432/db?sslmode=require' ./scripts/deploy-backend-aws.sh"
  exit 1
fi

# Get VPC and subnets (use default VPC to match RDS deploy)
echo "Fetching network config..."
VPC_ID="$(aws ec2 describe-vpcs --region "${REGION}" --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)"

# Get RDS security group from RDS stack (allows backend to connect to DB)
DB_SG=""
if aws cloudformation describe-stacks --region "${REGION}" --stack-name "${RDS_STACK_NAME}" &>/dev/null; then
  DB_SG="$(aws cloudformation describe-stacks --region "${REGION}" --stack-name "${RDS_STACK_NAME}" \
    --query "Stacks[0].Outputs[?OutputKey=='DBSecurityGroupId'].OutputValue" --output text 2>/dev/null || true)"
fi

if [[ -z "${VPC_ID}" || "${VPC_ID}" == "None" ]]; then
  echo "No VPC found. Deploy RDS first: ./scripts/deploy-rds.sh"
  exit 1
fi

read -r SUBNET_1 SUBNET_2 <<<"$(aws ec2 describe-subnets --region "${REGION}" --filters Name=vpc-id,Values="${VPC_ID}" --query 'Subnets[0:2].SubnetId' --output text)"

if [[ -z "${SUBNET_1:-}" || -z "${SUBNET_2:-}" ]]; then
  echo "Need at least two subnets in VPC ${VPC_ID}."
  exit 1
fi

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${PROJECT_NAME}-backend"

echo "Logging in to ECR..."
aws ecr get-login-password --region "${REGION}" | docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

echo "Creating ECR repository if needed..."
aws ecr describe-repositories --region "${REGION}" --repository-names "${PROJECT_NAME}-backend" 2>/dev/null || \
  aws ecr create-repository --region "${REGION}" --repository-name "${PROJECT_NAME}-backend"

echo "Building and pushing Docker image for linux/amd64 (ECS Fargate)..."
if docker buildx version >/dev/null 2>&1; then
  docker buildx build --platform linux/amd64 -t "${ECR_URI}:latest" --push ./backend
else
  echo "docker buildx not found, falling back to docker build + push."
  docker build --platform linux/amd64 -t "${ECR_URI}:latest" ./backend
  docker push "${ECR_URI}:latest"
fi

echo "Deploying CloudFormation stack ${STACK_NAME}..."
PARAMS=(
  "ProjectName=${PROJECT_NAME}"
  "VpcId=${VPC_ID}"
  "SubnetId1=${SUBNET_1}"
  "SubnetId2=${SUBNET_2}"
  "DatabaseUrl=${DATABASE_URL}"
  "JwtSecret=${JWT_SECRET}"
  "CorsOrigins=${CORS_ORIGINS}"
)
[[ -n "${DB_SG}" && "${DB_SG}" != "None" ]] && PARAMS+=("DBSecurityGroupId=${DB_SG}")

aws cloudformation deploy \
  --region "${REGION}" \
  --stack-name "${STACK_NAME}" \
  --template-file infra/aws/backend-ecs.yaml \
  --parameter-overrides "${PARAMS[@]}" \
  --capabilities CAPABILITY_NAMED_IAM

API_URL="$(aws cloudformation describe-stacks --region "${REGION}" --stack-name "${STACK_NAME}" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" --output text)"

echo ""
echo "Backend deployed: ${API_URL}"
echo "Set VITE_API_URL=${API_URL} for the frontend."
