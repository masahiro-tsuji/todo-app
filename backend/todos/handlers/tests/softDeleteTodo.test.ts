import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';
import { demoUserObj, ErrorMessages, toErrorBody } from '../../constants';
import { HttpStatus } from '../../types';
import { softDeleteTodo } from '../softDeleteTodo';

const mockSend = jest.fn();
const mockClient = { send: mockSend } as never;

const baseEvent = {
  rawPath: '/todos/12345',
  pathParameters: { id: '12345' },
  requestContext: { http: { method: 'DELETE' }, authorizer: { jwt: { claims: { sub: demoUserObj.userId } } } },
} as unknown as APIGatewayProxyEventV2WithJWTAuthorizer;

describe('ゴミ箱送りAPIの成功テスト', () => {
  beforeEach(() => {
    mockSend.mockClear();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-08T04:34:00.000Z'));
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

  afterEach(() => {
    jest.useRealTimers();
  });

  test('deletedAt を付与してゴミ箱送りに成功すること', async () => {
    const result = await softDeleteTodo(mockClient, baseEvent);

    const command = mockSend.mock.calls[0][0];

    expect(command.input.Key).toEqual({ userId: demoUserObj.userId, id: '12345' });
    expect(command.input.ConditionExpression).toBe('attribute_exists(id) AND attribute_not_exists(deletedAt)');
    expect(command.input.UpdateExpression).toBe('SET deletedAt = :now');
    expect(command.input.ExpressionAttributeValues).toEqual({ ':now': '2026-09-08T04:34:00.000Z' });
    expect(command.input.ReturnValues).toBe('ALL_NEW');

    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(result.body ?? '')).toMatchObject({
      id: '12345',
      deletedAt: '2026-09-08T04:34:00.000Z',
    });
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});

describe('ゴミ箱送りAPIのエラーテスト', () => {
  beforeEach(() => {
    mockSend.mockClear();
    jest.useRealTimers();
  });

  test('パスパラメーターに id がない場合 404 エラーを返すこと', async () => {
    const event = {
      rawPath: '/todos/undefined',
      pathParameters: {},
      requestContext: { http: { method: 'DELETE' } },
    } as unknown as APIGatewayProxyEventV2WithJWTAuthorizer;
    const result = await softDeleteTodo(mockClient, event);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.body).toBe(toErrorBody(ErrorMessages.NOT_FOUND));
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('存在しない id が指定されていた場合 404 エラーを返すこと', async () => {
    mockSend.mockRejectedValueOnce(
      new ConditionalCheckFailedException({ message: 'The conditional request failed', $metadata: {} }),
    );
    const result = await softDeleteTodo(mockClient, baseEvent);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.body).toBe(toErrorBody(ErrorMessages.TODO_NOT_FOUND));
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test('既にゴミ箱にある TODO の場合 404 エラーを返すこと', async () => {
    mockSend.mockRejectedValueOnce(
      new ConditionalCheckFailedException({ message: 'The conditional request failed', $metadata: {} }),
    );
    const result = await softDeleteTodo(mockClient, baseEvent);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.body).toBe(toErrorBody(ErrorMessages.TODO_NOT_FOUND));
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});
