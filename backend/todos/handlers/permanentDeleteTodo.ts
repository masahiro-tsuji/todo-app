import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, type DeleteCommandInput, type DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { ErrorMessages } from '../constants';
import { createErrorResponse, createJsonResponse } from '../libs';
import { HttpStatus } from '../types';

export const permanentDeleteTodo = async (
  dynamoDbClient: DynamoDBDocumentClient,
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const id = event.pathParameters?.id;
  if (!id) return createErrorResponse(HttpStatus.NOT_FOUND, ErrorMessages.NOT_FOUND);

  const userId = event.requestContext.authorizer.jwt.claims.sub as string;
  const input = {
    TableName: process.env.TABLE_NAME,
    Key: { userId, id },
    ConditionExpression: 'attribute_exists(id) AND attribute_exists(deletedAt)',
    ReturnValues: 'ALL_OLD',
  } as DeleteCommandInput;

  try {
    const result = await dynamoDbClient.send(new DeleteCommand(input));
    return createJsonResponse(HttpStatus.OK, result.Attributes);
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      return createErrorResponse(HttpStatus.NOT_FOUND, ErrorMessages.TODO_NOT_FOUND);
    }
    throw error;
  }
};
