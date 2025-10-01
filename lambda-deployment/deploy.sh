#!/bin/bash

# AWS Lambda Deployment Script
# This script packages and deploys the Lambda function

echo "Creating Lambda deployment package..."

# Create deployment package
cd lambda-deployment
zip -r sensor-data-lambda.zip .

echo "Deployment package created: sensor-data-lambda.zip"
echo ""
echo "To deploy to AWS Lambda:"
echo "1. Upload sensor-data-lambda.zip to AWS Lambda"
echo "2. Set handler to: lambda_function.lambda_handler"
echo "3. Set timeout to: 30 seconds"
echo "4. Set memory to: 256 MB"
echo ""
echo "Or use AWS CLI:"
echo "aws lambda create-function \\"
echo "  --function-name sensor-data-api \\"
echo "  --runtime python3.9 \\"
echo "  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \\"
echo "  --handler lambda_function.lambda_handler \\"
echo "  --zip-file fileb://sensor-data-lambda.zip \\"
echo "  --timeout 30 \\"
echo "  --memory-size 256"
