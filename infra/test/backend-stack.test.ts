import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as logs from 'aws-cdk-lib/aws-logs';
import { AuthStack } from '../lib/auth-stack';
import { BackendStack, TODOS_LAMBDA_NAME } from '../lib/backend-stack';

const getTemplate = () => {
  const app = new App({ context: { '@aws-cdk/aws-lambda:useCdkManagedLogGroup': true } });
  const authStack = new AuthStack(app, 'AuthStack');
  const stack = new BackendStack(app, 'BackendStack', {
    userPool: authStack.userPool,
    userPoolClient: authStack.userPoolClient,
  });
  const template = Template.fromStack(stack);
  return template;
};

describe('BackendStackのテスト', () => {
  test('BackendStackのSnapshotテスト', () => {
    const template = getTemplate();
    expect(template.toJSON()).toMatchSnapshot();
  });
});

describe('DynamoDBの設定について', () => {
  test('テーブル名が todos であること', () => {
    const template = getTemplate();
    template.hasResourceProperties('AWS::DynamoDB::Table', { TableName: 'todos' });
  });
  test('パーティションキーが「userId」,ソートキーが「id」であること', () => {
    const template = getTemplate();
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' },
        { AttributeName: 'id', KeyType: 'RANGE' },
      ],
    });
  });
  test('従量課金であること', () => {
    const template = getTemplate();
    template.hasResourceProperties('AWS::DynamoDB::Table', { BillingMode: dynamodb.BillingMode.PAY_PER_REQUEST });
  });
  test('Stack削除時にTableも破棄されること', () => {
    const template = getTemplate();
    template.hasResource('AWS::DynamoDB::Table', { DeletionPolicy: 'Delete' });
  });
});

describe('CloudWatchのログ設定について', () => {
  test('ログの保持期間が1週間であること', () => {
    const template = getTemplate();
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: `/aws/lambda/${TODOS_LAMBDA_NAME}`,
      RetentionInDays: logs.RetentionDays.ONE_WEEK,
    });
  });

  test('Stack削除時にログも破棄されること', () => {
    const template = getTemplate();
    template.hasResource('AWS::Logs::LogGroup', {
      Properties: { LogGroupName: `/aws/lambda/${TODOS_LAMBDA_NAME}` },
      DeletionPolicy: 'Delete',
    });
  });
});
