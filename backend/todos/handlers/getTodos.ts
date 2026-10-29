import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { createJsonResponse, queryTodosByUserId } from '../libs';
import { HttpStatus, todosStatusSchema } from '../types';

export const getTodos = async (
  dynamoDbClient: DynamoDBDocumentClient,
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const userId = event.requestContext.authorizer.jwt.claims.sub as string;
  const parsedStatus = todosStatusSchema.safeParse(event.queryStringParameters?.status);
  const todos = await queryTodosByUserId(dynamoDbClient, userId, parsedStatus.success ? parsedStatus.data : undefined);

  return createJsonResponse(HttpStatus.OK, todos);
};
