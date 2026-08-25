import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';
import { ErrorMessages } from './constants';
import { createTodo } from './handlers/createTodo';
import { getTodos } from './handlers/getTodos';
import { updateTodo } from './handlers/updateTodo';
import { createErrorJsonLog, createErrorResponse } from './libs';
import { HttpStatus } from './types';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const method = event.requestContext.http.method;
  const path = event.rawPath;
  const userId = event.requestContext.authorizer.jwt.claims.sub as string;

  try {
    if (path === '/todos') {
      if (method === 'GET') return await getTodos(docClient, event);
      if (method === 'POST') return await createTodo(docClient, event);
    }
    // NOTE: /todos/{id}も合致させるため
    if (path.startsWith('/todos/') && method === 'PATCH') return await updateTodo(docClient, event);

    return createErrorResponse(HttpStatus.NOT_FOUND, ErrorMessages.NOT_FOUND);
  } catch (error: unknown) {
    const errorLog = createErrorJsonLog({
      requestId: event.requestContext.requestId,
      message: ErrorMessages.INTERNAL_SERVER_ERROR.error,
      userId: userId,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    });
    console.error(errorLog);
    return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
  }
};
