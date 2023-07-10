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
    new dynamodb.Table(this, 'SportsEventsTable', {
      partitionKey: {
        name: 'event_id',
        type: dynamodb.AttributeType.STRING
      },
      tableName: 'TEST-SportsEvents',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ----------------------------------------------LAMBDAS------------------------------------------------------

    // Create a Lambda Role for Lambdas
    const LambdaRole = new iam.Role(this, 'LambdaRole', {
      roleName: 'MyLambda-Role',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // Add DynamoDB PutItem, Scan, GetItem policy statement
    const dynamoDBPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:PutItem', 'dynamodb:Scan', 'dynamodb:GetItem'],
      resources: ['arn:aws:dynamodb:eu-central-1:843186574710:table/TEST-SportsEvents'],
    });
    LambdaRole.addToPolicy(dynamoDBPolicy);

    // Create a Lambda function to log event data received from API Gateway to the DynamoDB Table
    const log_event_lambda = new lambda.Function(this, 'LogEventsLambdaFunction', {
      runtime: lambda.Runtime.PYTHON_3_8,
      functionName: "TEST-LogSportsEvents-Lambda",
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset('Lambdas/TEST-LogSportsEvents-Lambda'),
      role: LambdaRole,
    });

    // Create a Lambda function to get all events data in API Gateway from the DynamoDB Table
    const all_events_lambda = new lambda.Function(this, 'RetrieveAllEventsLambdaFunction', {
      runtime: lambda.Runtime.PYTHON_3_8,
      functionName: "TEST-RetrieveAllEvents-Lambda",
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset('Lambdas/TEST-RetrieveAllEvents-Lambda'),
      role: LambdaRole,
    });

    // Create a Lambda function to get single event data in API Gateway from the DynamoDB Table
    const single_event_lambda = new lambda.Function(this, 'RetrieveSingleEventsLambdaFunction', {
      runtime: lambda.Runtime.PYTHON_3_8,
      functionName: "TEST-RetrieveSingleEvents-Lambda",
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset('Lambdas/TEST-RetrieveSingleEvents-Lambda'),
      role: LambdaRole,
    });


    // ----------------------------------------------API GATEWAY------------------------------------------------------

    // Create the API Gateway
    const api = new apigateway.RestApi(this, 'SportsEventsAPI', {
      restApiName: 'TEST-SportsEventsAPI',
    });

    // Create the API Gateway resources
    const eventsResource = api.root.addResource('events');
    const singleeventResource = eventsResource.addResource('{event_id}')

    // Create the POST /events endpoint
    const logEventIntegration = new apigateway.LambdaIntegration(log_event_lambda);
    eventsResource.addMethod('POST', logEventIntegration);

    // Create the GET /events endpoint
    const RetrieveAllEventIntegration = new apigateway.LambdaIntegration(all_events_lambda);
    eventsResource.addMethod('GET', RetrieveAllEventIntegration);

    // Create the GET /events/event_id endpoint
    const RetrieveSingleEventIntegration = new apigateway.LambdaIntegration(single_event_lambda);
    singleeventResource.addMethod('GET', RetrieveSingleEventIntegration);
  }
}
