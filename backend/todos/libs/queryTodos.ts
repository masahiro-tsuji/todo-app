import { type DynamoDBDocumentClient, QueryCommand, type QueryCommandInput } from '@aws-sdk/lib-dynamodb';

export const queryTodosByUserId = async (
  dynamoDbClient: DynamoDBDocumentClient,
  userId: string,
  mode: 'active' | 'trash',
) => {
  const input: QueryCommandInput = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
    FilterExpression: mode === 'active' ? 'attribute_not_exists(deletedAt)' : 'attribute_exists(deletedAt)',
  };

  const result = await dynamoDbClient.send(new QueryCommand(input));
  const todos = (result?.Items ?? []).sort((a, b) =>
    mode === 'active'
      ? String(a.createdAt).localeCompare(String(b.createdAt))
      : String(b.deletedAt).localeCompare(String(a.deletedAt)),
  );
  return todos;
};
