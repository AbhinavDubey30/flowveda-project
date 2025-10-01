import json
import csv
import os
from datetime import datetime

def lambda_handler(event, context):
    """
    AWS Lambda function to read CSV sensor data and return as JSON
    """
    
    # CORS headers for API Gateway
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
    }
    
    try:
        # Handle preflight OPTIONS request
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'CORS preflight successful'})
            }
        
        # Read the CSV file from the Lambda package
        csv_file_path = os.path.join(os.path.dirname(__file__), 'sensor_data.csv')
        
        if not os.path.exists(csv_file_path):
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'CSV file not found'})
            }
        
        # Parse CSV data
        sensor_data = []
        
        with open(csv_file_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            
            for row in csv_reader:
                # Convert numeric values and clean data
                processed_row = {}
                for key, value in row.items():
                    # Clean column names (remove spaces, convert to lowercase)
                    clean_key = key.strip().lower().replace(' ', '_')
                    
                    # Convert numeric values
                    try:
                        if '.' in value:
                            processed_row[clean_key] = float(value)
                        else:
                            processed_row[clean_key] = int(value)
                    except ValueError:
                        # Keep as string if not numeric
                        processed_row[clean_key] = value.strip()
                
                sensor_data.append(processed_row)
        
        # Get query parameters for filtering
        query_params = event.get('queryStringParameters') or {}
        limit = query_params.get('limit')
        offset = query_params.get('offset')
        
        # Apply pagination if requested
        if limit:
            try:
                limit = int(limit)
                offset = int(offset) if offset else 0
                sensor_data = sensor_data[offset:offset + limit]
            except ValueError:
                pass  # Invalid limit/offset, return all data
        
        # Return successful response
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'data': sensor_data,
                'total_records': len(sensor_data),
                'timestamp': datetime.utcnow().isoformat() + 'Z'
            })
        }
        
    except Exception as e:
        # Return error response
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }
