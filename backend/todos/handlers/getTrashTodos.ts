import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { createJsonResponse, queryTodosByUserId } from '../libs';
import { HttpStatus } from '../types';

export const getTrashTodos = async (
  dynamoDbClient: DynamoDBDocumentClient,
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const userId = event.requestContext.authorizer.jwt.claims.sub as string;
  const todos = await queryTodosByUserId(dynamoDbClient, userId, 'trashed');

  return createJsonResponse(HttpStatus.OK, todos);
};
