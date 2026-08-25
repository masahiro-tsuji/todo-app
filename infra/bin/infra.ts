#!/usr/local/opt/node/bin/node
import * as cdk from 'aws-cdk-lib/core';
import { AuthStack } from '../lib/auth-stack';
import { BackendStack } from '../lib/backend-stack';
import { FrontendStack } from '../lib/frontend-stack';

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();

const authStack = new AuthStack(app, 'AuthStack', { env });
new BackendStack(app, 'BackendStack', { env, userPool: authStack.userPool, userPoolClient: authStack.userPoolClient });
new FrontendStack(app, 'FrontendStack', { env });
