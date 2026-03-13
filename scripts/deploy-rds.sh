#!/usr/bin/env bash
set -euo pipefail

STACK_NAME="${STACK_NAME:-utransit-rds}"
REGION="${AWS_REGION:-us-east-1}"
PROJECT_NAME="${PROJECT_NAME:-utransit}"
DB_NAME="${DB_NAME:-utransit}"
DB_USERNAME="${DB_USERNAME:-utransit_admin}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_INSTANCE_CLASS="${DB_INSTANCE_CLASS:-db.t3.micro}"
ALLOCATED_STORAGE="${ALLOCATED_STORAGE:-20}"
ALLOWED_CIDR="${ALLOWED_CIDR:-0.0.0.0/0}"
PUBLICLY_ACCESSIBLE="${PUBLICLY_ACCESSIBLE:-true}"

if ! command -v aws >/dev/null 2>&1; then
  echo "AWS CLI is required. Install and run 'aws configure' first."
  exit 1
fi

if [[ -z "${DB_PASSWORD}" ]]; then
  echo "Set DB_PASSWORD before running this script."
  echo "Example: DB_PASSWORD='super-secret' ./scripts/deploy-rds.sh"
  exit 1
fi

VPC_ID="$(aws ec2 describe-vpcs \
  --region "${REGION}" \
  --filters Name=isDefault,Values=true \
  --query 'Vpcs[0].VpcId' \
  --output text)"

if [[ -z "${VPC_ID}" || "${VPC_ID}" == "None" ]]; then
  echo "No default VPC found in ${REGION}. Set up a VPC/subnets and deploy manually with infra/aws/rds-postgres.yaml."
  exit 1
fi

read -r SUBNET_1 SUBNET_2 <<<"$(aws ec2 describe-subnets \
  --region "${REGION}" \
  --filters Name=vpc-id,Values="${VPC_ID}" \
  --query 'Subnets[0:2].SubnetId' \
  --output text)"

if [[ -z "${SUBNET_1:-}" || -z "${SUBNET_2:-}" ]]; then
  echo "Need at least two subnets in VPC ${VPC_ID}."
  exit 1
fi

echo "Deploying CloudFormation stack ${STACK_NAME} in ${REGION}..."
aws cloudformation deploy \
  --region "${REGION}" \
  --stack-name "${STACK_NAME}" \
  --template-file infra/aws/rds-postgres.yaml \
  --parameter-overrides \
    ProjectName="${PROJECT_NAME}" \
    VpcId="${VPC_ID}" \
    SubnetId1="${SUBNET_1}" \
    SubnetId2="${SUBNET_2}" \
    AllowedCidr="${ALLOWED_CIDR}" \
    DBName="${DB_NAME}" \
    DBUsername="${DB_USERNAME}" \
    DBPassword="${DB_PASSWORD}" \
    DBInstanceClass="${DB_INSTANCE_CLASS}" \
    AllocatedStorage="${ALLOCATED_STORAGE}" \
    PubliclyAccessible="${PUBLICLY_ACCESSIBLE}"

DB_ENDPOINT="$(aws cloudformation describe-stacks \
  --region "${REGION}" \
  --stack-name "${STACK_NAME}" \
  --query "Stacks[0].Outputs[?OutputKey=='DBEndpoint'].OutputValue" \
  --output text)"
DB_PORT="$(aws cloudformation describe-stacks \
  --region "${REGION}" \
  --stack-name "${STACK_NAME}" \
  --query "Stacks[0].Outputs[?OutputKey=='DBPort'].OutputValue" \
  --output text)"

echo ""
echo "RDS ready: ${DB_ENDPOINT}:${DB_PORT}"
echo "Set this in your .env:"
echo "DATABASE_URL=postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_ENDPOINT}:${DB_PORT}/${DB_NAME}?schema=public&sslmode=require"
