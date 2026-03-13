# Full AWS Deployment (Frontend + Backend + RDS)

Deploy the full UTransit stack: RDS (PostgreSQL) → Backend (ECS) → Frontend (S3 + CloudFront).

## Prerequisites

- AWS CLI configured (`aws configure`)
- Docker running (for backend image build)
- Node.js and npm

## Deploy Order

### 1. RDS (if not already deployed)

```bash
./scripts/deploy-rds.sh
```

### 2. Backend (ECS Fargate)

```bash
cd /path/to/aws-temp
set -a && source backend/.env && set +a
export AWS_REGION=us-west-2
./scripts/deploy-backend-aws.sh
```

Saves the API URL (e.g. `http://utransit-alb-xxx.us-west-2.elb.amazonaws.com`).

### 3. Frontend (S3 + CloudFront)

```bash
export AWS_REGION=us-west-2
./scripts/deploy-frontend-aws.sh
```

Builds the frontend with the backend API URL baked in, uploads to S3, and invalidates CloudFront.

## Result

- **Frontend**: `https://xxxxx.cloudfront.net` (from script output)
- **Backend**: `http://utransit-alb-xxx.elb.amazonaws.com`
- **Database**: RDS PostgreSQL (backend connects via security group)

The frontend calls the backend; the backend connects to RDS. CORS is preconfigured for CloudFront origins.

## GitHub-Based Auto Deploy (Recommended)

If you want deploys triggered by GitHub pushes (instead of running scripts from a laptop), use:

- Setup guide: `docs/aws-github-cicd-setup.md`
- Pipeline template: `infra/aws/cicd-pipeline.yaml`
- Helper script: `scripts/deploy-cicd.sh`
