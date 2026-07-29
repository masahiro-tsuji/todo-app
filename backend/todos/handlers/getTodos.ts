import { type DynamoDBDocumentClient, QueryCommand, type QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { demoUserObj } from '../constants';
import { createJsonResponse } from '../libs';
import { HttpStatus } from '../types';

export const getTodos = async (
  dynamoDbClient: DynamoDBDocumentClient,
  _event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const input: QueryCommandInput = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': demoUserObj.userId },
  };
  const result = await dynamoDbClient.send(new QueryCommand(input));
  const items = (result?.Items ?? []).sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));

  return createJsonResponse(HttpStatus.OK, items);
};
