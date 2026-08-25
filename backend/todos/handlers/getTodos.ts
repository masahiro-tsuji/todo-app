import { type DynamoDBDocumentClient, QueryCommand, type QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { createJsonResponse } from '../libs';
import { HttpStatus } from '../types';

export const getTodos = async (
  dynamoDbClient: DynamoDBDocumentClient,
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const userId = event.requestContext.authorizer.jwt.claims.sub as string;

  const input: QueryCommandInput = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
  };
  const result = await dynamoDbClient.send(new QueryCommand(input));
  const items = (result?.Items ?? []).sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));

  return createJsonResponse(HttpStatus.OK, items);
};
