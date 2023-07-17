#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CodingChallengeStack } from '../lib/codingchallenge-stack';

const app = new cdk.App();
new CodingChallengeStack(app, 'CodingChallengeStack', {

  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT || '1234567890',
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION || 'eu-central-1'
  },
});