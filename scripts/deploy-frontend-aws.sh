#!/usr/bin/env bash
set -euo pipefail
export AWS_PAGER=""

STACK_NAME="${STACK_NAME:-utransit-frontend}"
BACKEND_STACK_NAME="${BACKEND_STACK_NAME:-utransit-backend}"
REGION="${AWS_REGION:-us-west-2}"
PROJECT_NAME="${PROJECT_NAME:-utransit}"

if ! command -v aws >/dev/null 2>&1; then
  echo "AWS CLI required. Install and run 'aws configure'."
  exit 1
fi

# Get backend API URL (required for VITE_API_URL at build time)
if [[ -n "${API_URL:-}" ]]; then
  echo "Using API_URL from environment: ${API_URL}"
else
  echo "Fetching backend API URL from stack..."
  API_URL=""
  if aws cloudformation describe-stacks --region "${REGION}" --stack-name "${BACKEND_STACK_NAME}" &>/dev/null; then
    API_URL="$(aws cloudformation describe-stacks --region "${REGION}" --stack-name "${BACKEND_STACK_NAME}" \
      --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" --output text 2>/dev/null || true)"
    # Fallback: get ALB DNS from resources if stack still deploying (outputs not ready)
    if [[ -z "${API_URL}" || "${API_URL}" == "None" ]]; then
      ALB_ARN="$(aws cloudformation describe-stack-resources --region "${REGION}" --stack-name "${BACKEND_STACK_NAME}" \
        --query "StackResources[?ResourceType=='AWS::ElasticLoadBalancingV2::LoadBalancer'].PhysicalResourceId" --output text 2>/dev/null || true)"
      if [[ -n "${ALB_ARN}" ]]; then
        ALB_DNS="$(aws elbv2 describe-load-balancers --region "${REGION}" --load-balancer-arns "${ALB_ARN}" \
          --query "LoadBalancers[0].DNSName" --output text 2>/dev/null || true)"
        [[ -n "${ALB_DNS}" && "${ALB_DNS}" != "None" ]] && API_URL="http://${ALB_DNS}"
      fi
    fi
  fi

  if [[ -z "${API_URL}" || "${API_URL}" == "None" ]]; then
    echo "Backend stack ${BACKEND_STACK_NAME} not found or still deploying."
    echo ""
    echo "Option 1: Deploy backend first:"
    echo "  set -a && source backend/.env && set +a"
    echo "  export AWS_REGION=us-west-2"
    echo "  ./scripts/deploy-backend-aws.sh"
    echo ""
    echo "Option 2: Pass API URL manually (e.g. http://localhost:8000 for local backend):"
    echo "  API_URL=http://localhost:8000 ./scripts/deploy-frontend-aws.sh"
    exit 1
  fi
  echo "Backend API: ${API_URL}"
fi

# Extract ALB hostname for CloudFront origin (strip http:// or https://)
API_ORIGIN_DOMAIN="${API_URL#*://}"
API_ORIGIN_DOMAIN="${API_ORIGIN_DOMAIN%%/*}"

# Deploy CloudFormation (S3 + CloudFront with API proxy)
echo "Deploying frontend stack ${STACK_NAME}..."
aws cloudformation deploy \
  --region "${REGION}" \
  --stack-name "${STACK_NAME}" \
  --template-file infra/aws/frontend-s3-cloudfront.yaml \
  --parameter-overrides "ProjectName=${PROJECT_NAME}" "ApiOriginDomain=${API_ORIGIN_DOMAIN}" \
  --capabilities CAPABILITY_NAMED_IAM

BUCKET="$(aws cloudformation describe-stacks --region "${REGION}" --stack-name "${STACK_NAME}" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" --output text)"
DIST_ID="$(aws cloudformation describe-stacks --region "${REGION}" --stack-name "${STACK_NAME}" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" --output text)"
FRONTEND_URL="$(aws cloudformation describe-stacks --region "${REGION}" --stack-name "${STACK_NAME}" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendUrl'].OutputValue" --output text)"

# Build frontend with same-origin API (CloudFront proxies /api/* to backend)
echo "Building frontend with VITE_API_URL=${FRONTEND_URL} (API via /api proxy)..."
VITE_API_URL="${FRONTEND_URL}" npm run build

# Upload to S3
echo "Uploading to S3..."
aws s3 sync dist/ "s3://${BUCKET}/" --delete --region "${REGION}"

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id "${DIST_ID}" --paths "/*" --region "${REGION}" >/dev/null

echo ""
echo "Frontend deployed: ${FRONTEND_URL}"
echo "Backend CORS already allows *.cloudfront.net - no update needed."
