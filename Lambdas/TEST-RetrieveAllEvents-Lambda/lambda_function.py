import json
import boto3

dynamodb = boto3.resource('dynamodb')
ddbtable = dynamodb.Table('TEST-SportsEvents')

def lambda_handler(event, context):
    try:
        # Query DynamoDB to retrieve all events
        retrieve_all_events_details = ddbtable.scan()

        # Check if the event exists in DynamoDB
        if 'Item' in retrieve_all_events_details:

            # Return the success response with list of all Sport Events
            response = {
                'statusCode': 200,
                'body': json.dumps({
                    'status': 'success',
                    'events': retrieve_all_events_details['Items']
                }, indent=4)
            }
        else:
            # Return the error response not even 1 event is not found in DynamoDB
            response = {
                'statusCode': 404,
                'body': json.dumps({
                    'status': 'error',
                    'message': 'Event not found.'
                }, indent=4)
            }     

    except Exception as e:
        print('Error retrieving events:', str(e))

        # Return the error response
        response = {
            'statusCode': 500,
            'body': json.dumps({
                'status': 'error',
                'message': 'Failed to retrieve all events.'
            }, indent=4)
        }

    return response