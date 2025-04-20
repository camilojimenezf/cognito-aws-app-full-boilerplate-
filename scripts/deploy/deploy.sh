#!/bin/bash
set -e  # Exit on error

# Check if environment argument is provided
if [ -z "$1" ]; then
  echo "❌ Usage: $0 <environment> (e.g., development, staging, production)"
  exit 1
fi

ENVIRONMENT=$1
DEPLOY_ENV_FILE=".deploy.${ENVIRONMENT}.env"

# Ensure deploy env file exists
if [ ! -f "$DEPLOY_ENV_FILE" ]; then
  echo "❌ $DEPLOY_ENV_FILE file not found!"
  exit 1
fi

# Source deployment environment variables
echo "🔧 Loading deployment configuration from $DEPLOY_ENV_FILE..."
source "$DEPLOY_ENV_FILE"

# Validate required variables
for var in S3_BUCKET DISTRIBUTION_ID AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY; do
  if [ -z "${!var}" ]; then
    echo "❌ Error: $var is not set in $DEPLOY_ENV_FILE"
    exit 1
  fi
done

# Build frontend using Vite
if [ "$ENVIRONMENT" = "production" ]; then
  echo "🚀 Building frontend for $ENVIRONMENT..."
  npm run build
else
  echo "🚀 Building frontend for $ENVIRONMENT..."
  npm run build:$ENVIRONMENT
fi

# Export AWS credentials for the commands
export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

# Sync files to S3 using the specified AWS profile
echo "📤 Uploading to S3 bucket: $S3_BUCKET..."
aws s3 sync dist/ s3://$S3_BUCKET --delete

# Invalidate CloudFront cache using the specified AWS profile
echo "🚀 Invalidating CloudFront cache for distribution: $DISTRIBUTION_ID..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "✅ Frontend deployed successfully to $ENVIRONMENT!"