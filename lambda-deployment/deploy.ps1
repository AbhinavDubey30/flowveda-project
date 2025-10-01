# AWS Lambda Deployment Script for Windows PowerShell
# This script packages and deploys the Lambda function

Write-Host "Creating Lambda deployment package..." -ForegroundColor Green

# Create deployment package
Set-Location lambda-deployment

# Remove existing zip if it exists
if (Test-Path "sensor-data-lambda.zip") {
    Remove-Item "sensor-data-lambda.zip"
}

# Create zip file
Compress-Archive -Path "*.py", "*.csv", "*.txt" -DestinationPath "sensor-data-lambda.zip" -Force

Write-Host "Deployment package created: sensor-data-lambda.zip" -ForegroundColor Green
Write-Host ""
Write-Host "To deploy to AWS Lambda:" -ForegroundColor Yellow
Write-Host "1. Upload sensor-data-lambda.zip to AWS Lambda"
Write-Host "2. Set handler to: lambda_function.lambda_handler"
Write-Host "3. Set timeout to: 30 seconds"
Write-Host "4. Set memory to: 256 MB"
Write-Host ""
Write-Host "Or use AWS CLI:" -ForegroundColor Yellow
Write-Host "aws lambda create-function \"
Write-Host "  --function-name sensor-data-api \"
Write-Host "  --runtime python3.9 \"
Write-Host "  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \"
Write-Host "  --handler lambda_function.lambda_handler \"
Write-Host "  --zip-file fileb://sensor-data-lambda.zip \"
Write-Host "  --timeout 30 \"
Write-Host "  --memory-size 256"
