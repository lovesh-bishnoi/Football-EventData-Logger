import json
import boto3

dynamodb = boto3.resource('dynamodb')
ddbtable = dynamodb.Table('TEST-SportsEvents')

def lambda_handler(event, context):
    try:
        # Query DynamoDB to retrieve all events
        retrieve_all_events_details = ddbtable.scan()

        # Return the success response
        response = {
            'statusCode': 200,
            'body': json.dumps({
                'status': 'success',
                'events': retrieve_all_events_details['Items']
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