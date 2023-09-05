import json
import boto3
import os
from boto3.dynamodb.conditions import Key

DYNAMODB_TABLE_NAME = os.getenv("DYNAMODB_TABLE_NAME")

dynamodb = boto3.resource('dynamodb')
ddbtable = dynamodb.Table(DYNAMODB_TABLE_NAME)

def lambda_handler(event, context):
    try:
        # Extract the event ID from the path parameter of API Gateway
        event_id = event['pathParameters']['event_id']       

        # Retrieve the particular event_id data from DynamoDB
        retrieve_single_event_details = ddbtable.query(
            KeyConditionExpression=Key('event_id').eq(event_id),
            ScanIndexForward=False)['Items']

        # Check if the event_id exists in DynamoDB
        if len(retrieve_single_event_details) > 0:

            # Return the success response
            response = {
                'statusCode': 200,
                'body': json.dumps({
                    'status': 'success',
                    'event': retrieve_single_event_details
                }, indent=4)
            }
        else:
            # Return the error response if the event_id is not found in DynamoDB
            response = {
                'statusCode': 404,
                'body': json.dumps({
                    'status': 'error',
                    'message': 'No event found.'
                }, indent=4)
            }

    except Exception as e:
        # Return the error response with exception
        response = {
            'body': json.dumps({
                'statusCode': 500,
                'status': 'error',
                'message': 'Failed to retrieve the event: ' + str(e),
            }, indent=4)
        }
    return response