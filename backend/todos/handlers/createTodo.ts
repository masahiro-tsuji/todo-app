import { type DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

export const createTodo = async (docClient: DynamoDBDocumentClient, event: APIGatewayProxyEventV2) => {
  console.log({ event });
  const item = {
    userId: 'demo-user',
    todoId: crypto.randomUUID(),
    title: 'demo-title',
    description: 'demo-description',
    createdAt: Date.now(),
  };
  const params = { TableName: process.env.TABLE_NAME, Item: item };

  const data = await docClient.send(new PutCommand(params));
  console.log('result : ' + JSON.stringify(data));
  return {
    statusCode: 201,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  };
};
