import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';
import { demoUserObj, ErrorMessages, toErrorBody } from '../../constants';
import { HttpStatus } from '../../types';
import { permanentDeleteTodo } from '../permanentDeleteTodo';

const mockSend = jest.fn();
const mockClient = { send: mockSend } as never;

const baseEvent = {
  rawPath: '/todos/12345/permanent-delete',
  pathParameters: { id: '12345' },
  requestContext: { http: { method: 'DELETE' }, authorizer: { jwt: { claims: { sub: demoUserObj.userId } } } },
} as unknown as APIGatewayProxyEventV2WithJWTAuthorizer;

describe('完全削除APIの成功テスト', () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockSend.mockResolvedValueOnce({
      Attributes: {
        id: '12345',
        userId: demoUserObj.userId,
        title: 'テスト',
        createdAt: '2026-08-05T07:23:15.323Z',
        deletedAt: '2026-09-08T04:34:00.000Z',
      },
    });
  });

  test('ゴミ箱の TODO を物理削除すること', async () => {
    const result = await permanentDeleteTodo(mockClient, baseEvent);

    const command = mockSend.mock.calls[0][0];

    expect(command.input.Key).toEqual({ userId: demoUserObj.userId, id: '12345' });
    expect(command.input.ConditionExpression).toBe('attribute_exists(id) AND attribute_exists(deletedAt)');
    expect(command.input.ReturnValues).toBe('ALL_OLD');

    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(result.body ?? '')).toMatchObject({
      id: '12345',
      deletedAt: '2026-09-08T04:34:00.000Z',
    });
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});

describe('完全削除APIのエラーテスト', () => {
  beforeEach(() => {
    mockSend.mockClear();
  });

  test('パスパラメーターに id がない場合 404 エラーを返すこと', async () => {
    const event = {
      rawPath: '/todos/undefined/permanent-delete',
      pathParameters: {},
      requestContext: { http: { method: 'DELETE' } },
    } as unknown as APIGatewayProxyEventV2WithJWTAuthorizer;
    const result = await permanentDeleteTodo(mockClient, event);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.body).toBe(toErrorBody(ErrorMessages.NOT_FOUND));
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('存在しない id が指定されていた場合 404 エラーを返すこと', async () => {
    mockSend.mockRejectedValueOnce(
      new ConditionalCheckFailedException({ message: 'The conditional request failed', $metadata: {} }),
    );
    const result = await permanentDeleteTodo(mockClient, baseEvent);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.body).toBe(toErrorBody(ErrorMessages.TODO_NOT_FOUND));
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test('ゴミ箱にない TODO の場合 404 エラーを返すこと', async () => {
    mockSend.mockRejectedValueOnce(
      new ConditionalCheckFailedException({ message: 'The conditional request failed', $metadata: {} }),
    );
    const result = await permanentDeleteTodo(mockClient, baseEvent);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.body).toBe(toErrorBody(ErrorMessages.TODO_NOT_FOUND));
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});
