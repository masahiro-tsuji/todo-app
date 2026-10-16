import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { type DynamoDBDocumentClient, UpdateCommand, type UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { ErrorMessages } from '../constants';
import { createErrorResponse, createJsonResponse, createZodErrorResponse } from '../libs';
import { HttpStatus, updateTodoRequestSchema } from '../types';

export const updateTodo = async (
  dynamoDbClient: DynamoDBDocumentClient,
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const id = event.pathParameters?.id;
  if (!id) return createErrorResponse(HttpStatus.NOT_FOUND, ErrorMessages.NOT_FOUND);
  if (!event.body) return createErrorResponse(HttpStatus.BAD_REQUEST, ErrorMessages.BODY_REQUIRED);

  const userId = event.requestContext.authorizer.jwt.claims.sub as string;
  let body: unknown;
  const updates: string[] = [];
  const removes: string[] = [];
  const values: Record<string, string> = {};
  // TODO: 共通化
  try {
    body = JSON.parse(event.body);
  } catch {
    return createErrorResponse(HttpStatus.BAD_REQUEST, ErrorMessages.INVALID_JSON);
  }

  const resultSchema = updateTodoRequestSchema.safeParse(body);
  if (!resultSchema.success) return createZodErrorResponse(resultSchema.error.issues);

  const { data } = resultSchema;
  if (data.title !== undefined) {
    updates.push('title = :title');
    values[':title'] = data.title;
  }
  if (data.detail !== undefined) {
    updates.push('detail = :detail');
    values[':detail'] = data.detail;
  }
  if (data.completed !== undefined) {
    if (data.completed) {
      updates.push('completedAt = :completedAt');
      values[':completedAt'] = new Date().toISOString();
    } else {
      removes.push('completedAt');
    }
  }

  const expressionParts: string[] = [];
  if (updates.length > 0) expressionParts.push(`SET ${updates.join(',')}`);
  if (removes.length > 0) expressionParts.push(`REMOVE ${removes.join(',')}`);

  const input = {
    TableName: process.env.TABLE_NAME,
    Key: { userId, id }, // NOTE: userId, id(todoId) が一致する行を更新対象とする（partitionKey が userId, sortKey が id）
    ConditionExpression: 'attribute_exists(id)', // NOTE: id が合致する場合更新する（仕様上、存在しないidだった場合、新規作成してしまうため）
    UpdateExpression: expressionParts.join(' '),
    ...(Object.keys(values).length > 0 ? { ExpressionAttributeValues: values } : {}),
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
