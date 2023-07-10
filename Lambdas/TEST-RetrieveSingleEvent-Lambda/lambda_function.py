import json
import boto3

dynamodb = boto3.resource('dynamodb')
ddbtable = dynamodb.Table('TEST-SportsEvents')

def lambda_handler(event, context):
    try:
        # Extract the event ID from the path parameter of API Gateway
        event_id = event['pathParameters']['event_id']       

        # Retrieve the particular event_id data from DynamoDB
        retrieve_single_event_details = ddbtable.get_item(Key={'event_id': event_id})

        # Check if the event exists in DynamoDB
        if 'Item' in retrieve_single_event_details:

            # Return the success response
            response = {
                'statusCode': 200,
                'body': json.dumps({
                    'status': 'success',
                    'event': retrieve_single_event_details['Item']
                }, indent=4)
            }
        else:
            # Return the error response if the event_id is not found in DynamoDB
            response = {
                'statusCode': 404,
                'body': json.dumps({
                    'status': 'error',
                    'message': 'Event not found.'
                }, indent=4)
            }

    except Exception as e:
        print('Error retrieving event:', str(e))

        # Return the error response
        response = {
            'body': json.dumps({
                'statusCode': 500,
                'status': 'error',
                'message': 'Failed to retrieve the event.'
            }, indent=4)
        }

    return response