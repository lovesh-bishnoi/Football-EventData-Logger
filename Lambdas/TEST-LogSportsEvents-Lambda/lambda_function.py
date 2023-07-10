import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
ddbtable = dynamodb.Table('TEST-SportsEvents')

def lambda_handler(event, context):
    try:
        # Parse the JSON payload from the API Gateway Test response body
        api_payload = json.loads(event['body'])

        # Generate a unique event ID
        event_id = str(uuid.uuid4())

        # Prepare the list items to be inserted into DynamoDB Table
       
        item = {
                "event_id": event_id,
                "event_type": api_payload['event_type'],
                "opponent": api_payload['opponent'],
                "team": api_payload['team'],
                "timestamp": api_payload['timestamp'],
                "event_details": {
                    "goal_type": api_payload['event_details']['goal_type'],
                    "minute": str(api_payload['event_details']['minute']),
                    "player": {
                        "name": api_payload['event_details']['player']['name'],
                        "number": str(api_payload['event_details']['player']['number']),
                        "position": api_payload['event_details']['player']['position']
                        }
                    }
                }
     
        # Put the item to DynamoDB Table
        ddbtable.put_item(Item=item)

        # Return the success response after putting the item into DynamoDB Table
        response = {
            'statusCode': 201,
            'body': json.dumps({
                'status': 'success',
                'message': 'Event successfully logged in DynamoDB.',
                'event_id': event_id
            }, indent=4)
        }
        
    except Exception as e:
        print('Error logging the event:', str(e))

        # Return the error response
        response = {
            'statusCode': 500, 
            'body': json.dumps({
                'status': 'error',
                'message': 'Failed to log the event.'
            }, indent=4)
        }
    return response