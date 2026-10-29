import { type DynamoDBDocumentClient, QueryCommand, type QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import type { TodosStatus } from '../types';

const getFilterExpression = (status?: TodosStatus) => {
  if (status === 'active') return 'attribute_not_exists(deletedAt) AND attribute_not_exists(completedAt)';
  if (status === 'completed') return 'attribute_not_exists(deletedAt) AND attribute_exists(completedAt)';
  if (status === 'trashed') return 'attribute_exists(deletedAt)';
  return 'attribute_not_exists(deletedAt)';
};

export const queryTodosByUserId = async (
  dynamoDbClient: DynamoDBDocumentClient,
  userId: string,
  status?: TodosStatus,
) => {
  const input: QueryCommandInput = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
    FilterExpression: getFilterExpression(status),
  };

  const result = await dynamoDbClient.send(new QueryCommand(input));
  const todos = (result?.Items ?? []).sort((a, b) =>
    status === 'trashed'
      ? String(b.deletedAt).localeCompare(String(a.deletedAt))
      : String(a.createdAt).localeCompare(String(b.createdAt)),
  );
  return todos;
};
