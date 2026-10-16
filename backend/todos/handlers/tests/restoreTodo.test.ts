import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';
import { demoUserObj, ErrorMessages, toErrorBody } from '../../constants';
import { HttpStatus } from '../../types';
import { restoreTodo } from '../restoreTodo';

const mockSend = jest.fn();
const mockClient = { send: mockSend } as never;

const baseEvent = {
  rawPath: '/todos/12345/restore',
  pathParameters: { id: '12345' },
  requestContext: { http: { method: 'POST' }, authorizer: { jwt: { claims: { sub: demoUserObj.userId } } } },
} as unknown as APIGatewayProxyEventV2WithJWTAuthorizer;

describe('復元APIの成功テスト', () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockSend.mockResolvedValueOnce({
      Attributes: {
        id: '12345',
        userId: demoUserObj.userId,
        title: 'テスト',
        createdAt: '2026-08-05T07:23:15.323Z',
      },
    });
  });

  test('deletedAt を削除して一覧へ復元すること', async () => {
    const result = await restoreTodo(mockClient, baseEvent);

    const command = mockSend.mock.calls[0][0];

    expect(command.input.Key).toEqual({ userId: demoUserObj.userId, id: '12345' });
    expect(command.input.ConditionExpression).toBe('attribute_exists(id) AND attribute_exists(deletedAt)');
    expect(command.input.UpdateExpression).toBe('REMOVE deletedAt');
    expect(command.input.ReturnValues).toBe('ALL_NEW');

    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(result.body ?? '')).toMatchObject({
      id: '12345',
      title: 'テスト',
    });
    expect(JSON.parse(result.body ?? '')).not.toHaveProperty('deletedAt');
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});

describe('完了済みTODOの復元テスト', () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockSend.mockResolvedValueOnce({
      Attributes: {
        id: '12345',
        userId: demoUserObj.userId,
        title: '完了済みテスト',
        createdAt: '2026-08-05T07:23:15.323Z',
        completedAt: '2026-10-15T06:00:00.000Z',
      },
    });
  });

  test('completedAt がある TODO は deletedAt のみ外し completedAt を残すこと', async () => {
    const result = await restoreTodo(mockClient, baseEvent);
    const command = mockSend.mock.calls[0][0];
    const body = JSON.parse(result.body ?? '');

    expect(command.input.UpdateExpression).toBe('REMOVE deletedAt');
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(body).toMatchObject({
      id: '12345',
      title: '完了済みテスト',
      completedAt: '2026-10-15T06:00:00.000Z',
    });
    expect(body).not.toHaveProperty('deletedAt');
  });
});

describe('復元APIのエラーテスト', () => {
  beforeEach(() => {
    mockSend.mockClear();
  });

  test('パスパラメーターに id がない場合 404 エラーを返すこと', async () => {
    const event = {
      rawPath: '/todos/undefined/restore',
      pathParameters: {},
      requestContext: { http: { method: 'POST' } },
    } as unknown as APIGatewayProxyEventV2WithJWTAuthorizer;
    const result = await restoreTodo(mockClient, event);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.body).toBe(toErrorBody(ErrorMessages.NOT_FOUND));
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('存在しない id が指定されていた場合 404 エラーを返すこと', async () => {
    mockSend.mockRejectedValueOnce(
      new ConditionalCheckFailedException({ message: 'The conditional request failed', $metadata: {} }),
    );
    const result = await restoreTodo(mockClient, baseEvent);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.body).toBe(toErrorBody(ErrorMessages.TODO_NOT_FOUND));
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test('ゴミ箱にない TODO の場合 404 エラーを返すこと', async () => {
    mockSend.mockRejectedValueOnce(
      new ConditionalCheckFailedException({ message: 'The conditional request failed', $metadata: {} }),
    );
    const result = await restoreTodo(mockClient, baseEvent);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.body).toBe(toErrorBody(ErrorMessages.TODO_NOT_FOUND));
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});
