# AWS GitHub CI/CD Setup (No More Laptop-Only Deploys)

This sets up deployment from your GitHub repo branch directly to AWS:
- Backend: ECS Fargate (via `scripts/deploy-backend-aws.sh`)
- Frontend: S3 + CloudFront (via `scripts/deploy-frontend-aws.sh`)

After setup, pushing to `main` triggers deploy automatically.

## 1. One-time prerequisites

- RDS stack deployed (`utransit-rds`)
- AWS CLI authenticated to the correct account
- Repo pushed to GitHub (example: `xaderF/aws-temp`)

## 2. Create GitHub connection in AWS Console

1. Open AWS Console -> `Developer Tools` -> `Connections`.
2. Click `Create connection`.
3. Provider: `GitHub`.
4. Install/authorize the AWS connector app to your repo.
5. Save and copy the **Connection ARN**.
6. In the connection list, ensure status is `Available`.

## 3. Save backend secrets in SSM Parameter Store

Use `SecureString` parameters (recommended path names below):

```bash
aws ssm put-parameter \
  --name "/utransit/prod/database_url" \
  --type "SecureString" \
  --value "postgresql://utransit_admin:REPLACE_ME@YOUR_RDS_ENDPOINT:5432/utransit?sslmode=require" \
  --overwrite \
  --region us-west-2

aws ssm put-parameter \
  --name "/utransit/prod/jwt_secret" \
  --type "SecureString" \
  --value "replace-with-a-long-random-secret" \
  --overwrite \
  --region us-west-2
```

## 4. Deploy the CI/CD stack

From repo root:

```bash
chmod +x scripts/deploy-cicd.sh

export AWS_REGION="us-west-2"
export GITHUB_CONNECTION_ARN="arn:aws:codestar-connections:us-west-2:123456789012:connection/xxxxxx"
export GITHUB_REPO="xaderF/aws-temp"
export GITHUB_BRANCH="main"

./scripts/deploy-cicd.sh
```

This creates:
- CodePipeline
- Backend deploy CodeBuild project
- Frontend deploy CodeBuild project
- Artifact bucket (unless you pass an existing one)

## 5. What you must change in AWS Console

1. `CodeConnections`: create/authorize GitHub connection and keep it `Available`.
2. `SSM Parameter Store`: add/update:
- `/utransit/prod/database_url`
- `/utransit/prod/jwt_secret`
3. `CodePipeline`: open the created pipeline and click `Release change` for first run.

## 6. Normal workflow after setup

```bash
git add .
git commit -m "your change"
git push origin main
```

Push to `main` triggers:
1. Backend deploy
2. Frontend deploy

## 7. Troubleshooting

- If source stage fails: connection ARN is wrong or not `Available`.
- If backend stage fails on DB auth: update `/utransit/prod/database_url` with correct password.
- If frontend stage fails on API URL lookup: backend stack name mismatch (`utransit-backend` by default).
- If push is rejected:

```bash
git pull --rebase origin main
git push origin main
```
