import json
import boto3
import os
from boto3.dynamodb.conditions import Key

DYNAMODB_TABLE_NAME = os.getenv("DYNAMODB_TABLE_NAME")

dynamodb = boto3.resource('dynamodb')
ddbtable = dynamodb.Table(DYNAMODB_TABLE_NAME)

def lambda_handler(event, context):
    try:
        # Extract the Match ID from the path parameter of API Gateway
        match_id = event['pathParameters']['match_id']      

        # Retrieve all events details of a particular match from DynamoDB
        retrieve_all_events_details = ddbtable.query(
            IndexName="match_idGSI",
            KeyConditionExpression=Key('match_id').eq(match_id),
            ScanIndexForward=False,
            Limit=5,
            )['Items'] 

        # Check if the match_id exists in DynamoDB
        if len(retrieve_all_events_details) > 0:

            # Return the success response
            response = {
                'statusCode': 200,
                'body': json.dumps({
                    'status': 'success',
                    'match_events': retrieve_all_events_details
                }, indent=4)
            }
        else:
            # Return the error response if the match_id is not found in DynamoDB
            response = {
                'statusCode': 404,
                'body': json.dumps({
                    'status': 'error',
                    'message': 'No Match found.'
                }, indent=4)
            }

    except Exception as e:
        # Return the error response with exception
        response = {
            'body': json.dumps({
                'statusCode': 500,
                'status': 'error',
                'message': 'Failed to retrieve the match events: ' + str(e),
            }, indent=4)
        }
    return response
