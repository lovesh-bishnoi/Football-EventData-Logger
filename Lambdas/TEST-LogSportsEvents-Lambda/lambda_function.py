import json
import boto3
import os
import datetime
import uuid
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

DDB_TABLE_NAME = os.getenv("DDB_TABLE_NAME")

dynamodb = boto3.resource('dynamodb')
ddbtable = dynamodb.Table(DDB_TABLE_NAME)

def lambda_handler(event, context):
    try:
        # Generate a unique event ID and timestamp
        event_id = str(uuid.uuid4())
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        new_items = {
            "timestamp": str(timestamp),
            "event_id": 'EVT-'f"{event_id}"
        }
        new_items.update(event)

        # Put the item to DynamoDB Table
        ddbtable.put_item(Item=new_items)
        logger.info('Item successfully inserted into DynamoDB Table.')

        # Return the success response after putting the item into DynamoDB Table
        response = {
            'body': json.dumps({
                'status': 'success',
                "message": "Event successfully logged.",
                'event_id': new_items['event_id']
            }, indent=4)
        }
    
    except Exception as e:
        response = {
            'body': json.dumps({
                'status': 'error',
                'message': 'Event failed to log.',
                'error_details': str(e)
            }, indent=4)
        }

    return response