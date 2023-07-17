import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class CodingChallengeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ----------------------------------------------DYNAMODB------------------------------------------------------

    // Create a dynamoDB table to store the Sports log events sent from Lambda function using API gateway
    const table = new dynamodb.Table(this, 'SportsEventsTable', {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'event_id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    table.addGlobalSecondaryIndex({
      indexName: "match_idGSI",
      partitionKey: { name: "match_id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "timestamp", type: dynamodb.AttributeType.STRING },
    });
    const tableArnGSI = table.tableArn + '/index/match_idGSI'

    // ----------------------------------------------LAMBDAS------------------------------------------------------

    // Create a Lambda Role for Lambdas
    const lambdarole = new iam.Role(this, 'LambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaDynamoDBExecutionRole')
      ],
    });

    // Add DynamoDB PutItem, Query policy statement
    const lambda_dynambodb_access_policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:PutItem', 'dynamodb:Query'],
      resources: [table.tableArn, tableArnGSI],
    });
    lambdarole.addToPolicy(lambda_dynambodb_access_policy);

    const lambdaCommonProps = {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda_function.lambda_handler',
      role: lambdarole,
      environment: {
        DDB_TABLE_NAME: table.tableName
      },
    }

    // Create a Lambda function to log event data received from API Gateway to the DynamoDB Table
    const log_event_lambda = new lambda.Function(this, 'LogEventsLambdaFunction', {
      functionName: `TEST-${this.stackName}-LogEvent-Lambda`,
      code: lambda.Code.fromAsset('Lambdas/TEST-LogSportsEvents-Lambda'),
      ...lambdaCommonProps
    });

    // Create a Lambda function to get all events data in API Gateway from the DynamoDB Table
    const all_events_lambda = new lambda.Function(this, 'RetrieveAllEventsLambdaFunction', {
      functionName: `TEST-${this.stackName}-GetAllEvents-Lambda`,
      code: lambda.Code.fromAsset('Lambdas/TEST-RetrieveAllEvents-Lambda'),
      ...lambdaCommonProps
    });

    // Create a Lambda function to get single event data in API Gateway from the DynamoDB Table
    const single_event_lambda = new lambda.Function(this, 'RetrieveSingleEventsLambdaFunction', {
      functionName: `TEST-${this.stackName}-GetSingleEvent-Lambda`,
      code: lambda.Code.fromAsset('Lambdas/TEST-RetrieveSingleEvent-Lambda'),
      ...lambdaCommonProps
    });

    // ----------------------------------------------API GATEWAY------------------------------------------------------

    // Create the API Gateway
    const api = new apigateway.RestApi(this, 'SportsEventsAPI', {
      restApiName: `TEST-${this.stackName}-RestAPI`,
    });

    // Create the API Gateway resource named events
    const eventsResource = api.root.addResource('events');

    // Set the response body for the API Gateway endpoint
    const integration_response = [
      {
        statusCode: '201',
        responseTemplates: { 'application/json': `#set($inputRoot = $input.path('$')) $inputRoot.body` }
      },
      {
        statusCode: '500',
        responseTemplates: { 'application/json': `{"message": "Internal server error"}` }
      }
    ]

    // Json payload validation at API Gateway before passing it to the lambda function
    const request_template = {
      'application/json': `#set($inputRoot = $input.path('$'))
        {
          "match_id": "$inputRoot.match_id",
          "team": "$inputRoot.team",
          "opponent": "$inputRoot.opponent",
          "event_type": "$inputRoot.event_type",
          "event_details": {
            "player": {
              "name": "$inputRoot.event_details.player.name",
              "position": "$inputRoot.event_details.player.position",
              "number": "$inputRoot.event_details.player.number"
            },
            "goal_type": "$inputRoot.event_details.goal_type",
            "minute": "$inputRoot.event_details.minute"
          }
        }`}
 
    // Create the POST method for /events endpoint
    const logEventIntegration = new apigateway.LambdaIntegration(log_event_lambda, {
      proxy: false,
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      integrationResponses: integration_response,
      requestTemplates: request_template});

    eventsResource.addMethod('POST', logEventIntegration, {
      methodResponses: [
        { statusCode: '201' },  
        { statusCode: '500' }
      ]});


    // Create the API Gateway resource (events/match_id)
    const alleventsResource = eventsResource.addResource('{match_id}')

    // Create the GET method for /events/match_id endpoint
    const RetrieveAllEventIntegration = new apigateway.LambdaIntegration(all_events_lambda);
    alleventsResource.addMethod('GET', RetrieveAllEventIntegration);


    // Create the new API Gateway resource named event
    const eventResource = api.root.addResource('event');

    // Create the API Gateway resource (event/event_id)
    const singleeventResource = eventResource.addResource('{event_id}')

    // Create the GET method for /event/event_id endpoint
    const RetrieveSingleEventIntegration = new apigateway.LambdaIntegration(single_event_lambda);
    singleeventResource.addMethod('GET', RetrieveSingleEventIntegration);
  }
}
