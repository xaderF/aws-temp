#!/usr/bin/env bash
set -euo pipefail

STACK_NAME="${STACK_NAME:-utransit-cicd}"
REGION="${AWS_REGION:-us-west-2}"
PROJECT_NAME="${PROJECT_NAME:-utransit}"
PIPELINE_NAME="${PIPELINE_NAME:-utransit-github-deploy}"

GITHUB_CONNECTION_ARN="${GITHUB_CONNECTION_ARN:-}"
GITHUB_REPO="${GITHUB_REPO:-}"
GITHUB_BRANCH="${GITHUB_BRANCH:-main}"

BACKEND_STACK_NAME="${BACKEND_STACK_NAME:-utransit-backend}"
FRONTEND_STACK_NAME="${FRONTEND_STACK_NAME:-utransit-frontend}"
RDS_STACK_NAME="${RDS_STACK_NAME:-utransit-rds}"

DATABASE_URL_SSM_PATH="${DATABASE_URL_SSM_PATH:-/utransit/prod/database_url}"
JWT_SECRET_SSM_PATH="${JWT_SECRET_SSM_PATH:-/utransit/prod/jwt_secret}"
CORS_ORIGINS="${CORS_ORIGINS:-http://localhost:5173,http://localhost:8080,https://*.amazonaws.com,https://*.cloudfront.net}"

ARTIFACT_BUCKET_NAME="${ARTIFACT_BUCKET_NAME:-}"

if ! command -v aws >/dev/null 2>&1; then
  echo "AWS CLI required. Install and run 'aws configure'."
  exit 1
fi

if [[ -z "${GITHUB_CONNECTION_ARN}" ]]; then
  echo "Set GITHUB_CONNECTION_ARN."
  echo "Example: GITHUB_CONNECTION_ARN='arn:aws:codestar-connections:...:connection/xxxx' ./scripts/deploy-cicd.sh"
  exit 1
fi

if [[ -z "${GITHUB_REPO}" ]]; then
  echo "Set GITHUB_REPO in owner/repo format (example: xaderF/aws-temp)."
  exit 1
fi

echo "Deploying CI/CD stack ${STACK_NAME} in ${REGION}..."
PARAMS=(
  "ProjectName=${PROJECT_NAME}"
  "PipelineName=${PIPELINE_NAME}"
  "GitHubConnectionArn=${GITHUB_CONNECTION_ARN}"
  "GitHubRepository=${GITHUB_REPO}"
  "GitHubBranch=${GITHUB_BRANCH}"
  "BackendStackName=${BACKEND_STACK_NAME}"
  "FrontendStackName=${FRONTEND_STACK_NAME}"
  "RdsStackName=${RDS_STACK_NAME}"
  "DatabaseUrlSsmPath=${DATABASE_URL_SSM_PATH}"
  "JwtSecretSsmPath=${JWT_SECRET_SSM_PATH}"
  "CorsOrigins=${CORS_ORIGINS}"
)

if [[ -n "${ARTIFACT_BUCKET_NAME}" ]]; then
  PARAMS+=("ArtifactBucketName=${ARTIFACT_BUCKET_NAME}")
fi

aws cloudformation deploy \
  --region "${REGION}" \
  --stack-name "${STACK_NAME}" \
  --template-file infra/aws/cicd-pipeline.yaml \
  --parameter-overrides "${PARAMS[@]}" \
  --capabilities CAPABILITY_NAMED_IAM

PIPELINE_OUTPUT="$(aws cloudformation describe-stacks \
  --region "${REGION}" \
  --stack-name "${STACK_NAME}" \
  --query "Stacks[0].Outputs[?OutputKey=='PipelineName'].OutputValue" \
  --output text)"

echo ""
echo "CI/CD ready. Pipeline: ${PIPELINE_OUTPUT}"
echo "Push to ${GITHUB_BRANCH} on ${GITHUB_REPO} to trigger deploy."
