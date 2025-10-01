# AWS Lambda + API Gateway Deployment Guide

## Overview
This guide will help you deploy your water quality sensor data API using AWS Lambda and API Gateway. The setup creates a serverless API that serves your CSV data as JSON.

## Prerequisites
- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Python 3.9+ installed locally
- Your CSV data files ready

## Step 1: Prepare the Deployment Package

### 1.1 Create the Lambda Package
```powershell
# Navigate to your project directory
cd "C:\Users\nikhi\Downloads\flowveda_project (3)\flowveda_project"

# Run the PowerShell deployment script
.\lambda-deployment\deploy.ps1
```

This creates `sensor-data-lambda.zip` in the `lambda-deployment` folder.

### 1.2 Verify Package Contents
```powershell
# Check the zip file contents
Expand-Archive -Path "lambda-deployment\sensor-data-lambda.zip" -DestinationPath "temp-check" -Force
Get-ChildItem "temp-check"
Remove-Item "temp-check" -Recurse -Force
```

## Step 2: Deploy Lambda Function

### Option A: Using AWS Console (Beginner-Friendly)

1. **Open AWS Lambda Console**
   - Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda/)
   - Click "Create function"

2. **Configure Function**
   - Function name: `sensor-data-api`
   - Runtime: `Python 3.9`
   - Architecture: `x86_64`
   - Click "Create function"

3. **Upload Code**
   - In the function overview, click "Upload from" → ".zip file"
   - Upload `lambda-deployment\sensor-data-lambda.zip`
   - Click "Save"

4. **Configure Function Settings**
   - Handler: `lambda_function.lambda_handler`
   - Timeout: `30 seconds`
   - Memory: `256 MB`
   - Click "Save"

5. **Test the Function**
   - Click "Test"
   - Create new test event with this JSON:
   ```json
   {
     "httpMethod": "GET",
     "queryStringParameters": null
   }
   ```
   - Click "Test" and verify the response

### Option B: Using AWS CLI

1. **Create IAM Role** (if you don't have one)
```bash
aws iam create-role --role-name lambda-execution-role --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}'

aws iam attach-role-policy --role-name lambda-execution-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

2. **Deploy Lambda Function**
```bash
aws lambda create-function \
  --function-name sensor-data-api \
  --runtime python3.9 \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://lambda-deployment/sensor-data-lambda.zip \
  --timeout 30 \
  --memory-size 256
```

## Step 3: Create API Gateway

### Option A: Using AWS Console

1. **Create API**
   - Go to [API Gateway Console](https://console.aws.amazon.com/apigateway/)
   - Click "Create API"
   - Choose "REST API" → "Build"
   - API name: `water-quality-api`
   - Description: `API for water quality sensor data`
   - Click "Create API"

2. **Create Resource**
   - Click "Actions" → "Create Resource"
   - Resource Name: `sensor-data`
   - Resource Path: `/sensor-data`
   - Enable CORS: ✅
   - Click "Create Resource"

3. **Create Method**
   - Select `/sensor-data` resource
   - Click "Actions" → "Create Method"
   - Choose "GET"
   - Integration type: `Lambda Function`
   - Lambda Function: `sensor-data-api`
   - Click "Save"

4. **Enable CORS**
   - Select `/sensor-data` resource
   - Click "Actions" → "Enable CORS"
   - Access-Control-Allow-Origin: `*`
   - Access-Control-Allow-Headers: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
   - Access-Control-Allow-Methods: `GET,OPTIONS`
   - Click "Enable CORS and replace existing CORS headers"

5. **Deploy API**
   - Click "Actions" → "Deploy API"
   - Deployment stage: `[New Stage]`
   - Stage name: `dev`
   - Click "Deploy"

6. **Get API Endpoint**
   - Note the "Invoke URL" (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/dev`)

### Option B: Using AWS CLI

1. **Create API**
```bash
aws apigateway create-rest-api --name water-quality-api --description "API for water quality sensor data"
```

2. **Get API ID and Root Resource ID**
```bash
API_ID=$(aws apigateway get-rest-apis --query 'items[?name==`water-quality-api`].id' --output text)
ROOT_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?path==`/`].id' --output text)
```

3. **Create Resource**
```bash
aws apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part sensor-data
```

4. **Create GET Method**
```bash
RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?pathPart==`sensor-data`].id' --output text)

aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method GET \
  --authorization-type NONE
```

5. **Set Lambda Integration**
```bash
aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method GET \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:YOUR_ACCOUNT_ID:function:sensor-data-api/invocations"
```

6. **Deploy API**
```bash
aws apigateway create-deployment --rest-api-id $API_ID --stage-name dev
```

## Step 4: Test Your API

### Test the Endpoint
```bash
# Replace with your actual API endpoint
curl "https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/sensor-data"
```

### Test with Parameters
```bash
# Get first 10 records
curl "https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/sensor-data?limit=10"

# Get records 11-20
curl "https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/sensor-data?limit=10&offset=10"
```

## Step 5: Integrate with Your Website

### 5.1 Add the JavaScript Code
Copy the contents of `frontend-integration.js` to your website.

### 5.2 Update API Endpoint
In the JavaScript code, replace the placeholder with your actual API endpoint:
```javascript
const API_ENDPOINT = 'https://your-actual-api-id.execute-api.your-region.amazonaws.com/dev';
```

### 5.3 Add HTML Structure
Add this HTML to your website where you want to display sensor data:
```html
<div id="sensor-readings">
    <!-- Sensor readings will be populated here -->
</div>

<div id="error-message" style="display: none; color: red;">
    <!-- Error messages will be shown here -->
</div>

<button onclick="window.waterQualityAPI.clearCache()">Refresh Data</button>
```

### 5.4 Example Usage
```javascript
// Fetch latest 5 readings
waterQualityAPI.getLatestReadings(5).then(data => {
    console.log('Latest readings:', data);
});

// Fetch all data
waterQualityAPI.fetchSensorData().then(response => {
    console.log('Total records:', response.total_records);
    console.log('Data:', response.data);
});
```

## Step 6: Monitor and Troubleshoot

### CloudWatch Logs
- Go to [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/)
- Click "Log groups"
- Find `/aws/lambda/sensor-data-api`
- View logs for debugging

### Common Issues

1. **CORS Errors**
   - Ensure CORS is enabled in API Gateway
   - Check Lambda function returns proper CORS headers

2. **Lambda Timeout**
   - Increase timeout in Lambda configuration
   - Optimize CSV parsing if needed

3. **Permission Errors**
   - Ensure Lambda has permission to invoke from API Gateway
   - Check IAM roles and policies

## Cost Estimation

### Lambda Costs
- **Requests**: $0.20 per 1M requests
- **Duration**: $0.0000166667 per GB-second
- **Estimated monthly cost**: $1-5 for typical usage

### API Gateway Costs
- **REST API**: $3.50 per million API calls
- **Data transfer**: $0.09 per GB
- **Estimated monthly cost**: $2-10 for typical usage

## Security Considerations

1. **API Keys**: Consider adding API key authentication for production
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **HTTPS**: Always use HTTPS endpoints
4. **CORS**: Restrict CORS origins to your domain in production

## Next Steps

1. **Add Authentication**: Implement API key or JWT authentication
2. **Add Caching**: Use CloudFront for better performance
3. **Add Monitoring**: Set up CloudWatch alarms
4. **Add More Endpoints**: Create endpoints for specific data queries
5. **Database Integration**: Consider moving from CSV to DynamoDB for better performance

## Support

If you encounter issues:
1. Check CloudWatch logs
2. Verify IAM permissions
3. Test Lambda function independently
4. Check API Gateway configuration
5. Review CORS settings
