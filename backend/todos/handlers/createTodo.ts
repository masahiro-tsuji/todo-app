import { type DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { demoUserObj, ErrorMessages } from '../constants';
import { createErrorResponse, createJsonResponse, createZodErrorResponse } from '../libs';
import { createTodoBodySchema, HttpStatus } from '../types';

export const createTodo = async (
  dynamoDbClient: DynamoDBDocumentClient,
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  if (!event.body) return createErrorResponse(HttpStatus.BAD_REQUEST, ErrorMessages.BODY_REQUIRED);

  let body: unknown;

  try {
    body = JSON.parse(event.body);
  } catch {
    return createErrorResponse(HttpStatus.BAD_REQUEST, ErrorMessages.INVALID_JSON);
  }

  const result = createTodoBodySchema.safeParse(body);
  if (!result.success) return createZodErrorResponse(result.error.issues);

  const { data } = result;
  const item = {
    userId: demoUserObj.userId,
    todoId: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    createdAt: new Date().toISOString(),
  };
  const params = { TableName: process.env.TABLE_NAME, Item: item };
  await dynamoDbClient.send(new PutCommand(params));
  return createJsonResponse(HttpStatus.CREATED, item);
};
