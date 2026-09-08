import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { type DynamoDBDocumentClient, UpdateCommand, type UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { ErrorMessages } from '../constants';
import { createErrorResponse, createJsonResponse } from '../libs';
import { HttpStatus } from '../types';

export const softDeleteTodo = async (
  dynamoDbClient: DynamoDBDocumentClient,
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const now = new Date().toISOString();
  const id = event.pathParameters?.id;
  if (!id) return createErrorResponse(HttpStatus.NOT_FOUND, ErrorMessages.NOT_FOUND);

  const userId = event.requestContext.authorizer.jwt.claims.sub as string;
  const input = {
    TableName: process.env.TABLE_NAME,
    Key: { userId, id },
    ConditionExpression: 'attribute_exists(id) AND attribute_not_exists(deletedAt)',
    UpdateExpression: 'SET deletedAt = :now',
    ExpressionAttributeValues: { ':now': now },
    ReturnValues: 'ALL_NEW',
  } as UpdateCommandInput;

  try {
    const result = await dynamoDbClient.send(new UpdateCommand(input));
    return createJsonResponse(HttpStatus.OK, result.Attributes);
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      return createErrorResponse(HttpStatus.NOT_FOUND, ErrorMessages.TODO_NOT_FOUND);
    }
    throw error;
  }
};
