import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import type { Construct } from 'constructs';

const todosPath = path.join(__dirname, '../../backend/todos');
const TODOS_LAMBDA_NAME = 'todos-function';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /** DynamoDBの設定 */
    const todosTable = new dynamodb.Table(this, 'TodosTable', {
      tableName: 'todos',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'todoId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // スタック削除時にテーブルも消える
    });

    /** CloudWatchのログ設定 */
    const todosLambdaLogGroup = new logs.LogGroup(this, 'TodosHandlerLogGroup', {
      logGroupName: `/aws/lambda/${TODOS_LAMBDA_NAME}`, // ログの保存先
      retention: logs.RetentionDays.ONE_WEEK, // ログの保管期間
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    /** Lambdaの設定 */
    const todosLambda = new NodejsFunction(this, 'TodosHandler', {
      entry: path.join(todosPath, 'index.ts'),
      functionName: TODOS_LAMBDA_NAME,
      projectRoot: todosPath,
      handler: 'handler',
      runtime: Runtime.NODEJS_24_X,
      environment: { TABLE_NAME: todosTable.tableName },
      depsLockFilePath: path.join(todosPath, 'package-lock.json'), // デフォルトで/infra配下のlockファイル(依存関係)を参照する為、別明示的に/backend/todos側のlockファイルを参照させる
      logGroup: todosLambdaLogGroup,
    });

    // dynamodb読み取り権限をLambdaに付与
    todosTable.grantReadWriteData(todosLambda);

    //  APIGateway定義
    const todosIntegration = new HttpLambdaIntegration('todosIntegration', todosLambda);
    const httpApi = new apigatewayv2.HttpApi(this, 'TodoApi', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [
          apigatewayv2.CorsHttpMethod.GET,
          apigatewayv2.CorsHttpMethod.HEAD,
          apigatewayv2.CorsHttpMethod.OPTIONS,
          apigatewayv2.CorsHttpMethod.POST,
        ],
      },
    });

    httpApi.addRoutes({ methods: [apigatewayv2.HttpMethod.POST], path: '/todos', integration: todosIntegration });

    new cdk.CfnOutput(this, 'ApiUrl', { value: httpApi.url ?? '', description: 'TODO API の URL' });
  }
}
