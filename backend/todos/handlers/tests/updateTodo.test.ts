import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';
import { demoUserObj, ErrorMessages, toErrorBody } from '../../constants';
import { HttpStatus } from '../../types';
import { updateTodo } from '../updateTodo';

const mockSend = jest.fn();
const mockClient = { send: mockSend } as never;

const baseEvent = {
  rawPath: '/todos/12345',
  pathParameters: { id: '12345' },
  requestContext: { http: { method: 'PATCH' }, authorizer: { jwt: { claims: { sub: demoUserObj.userId } } } },
} as unknown as APIGatewayProxyEventV2WithJWTAuthorizer;

describe('更新処理APIの成功テスト', () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockSend.mockResolvedValueOnce({
      Attributes: {
        id: '12345',
        userId: 'demo-user-id',
        title: 'あいうえお',
        detail: 'かきくけこ',
        createdAt: '2026-08-05T07:23:15.323Z',
      },
    });
  });

  test('タイトルの更新が成功すること', async () => {
    const body = JSON.stringify({ title: 'あいうえお' });
    const result = await updateTodo(mockClient, { ...baseEvent, body });

    const command = mockSend.mock.calls[0][0];

    expect(command.input.Key).toEqual({ userId: 'demo-user-id', id: '12345' });
    expect(command.input.ConditionExpression).toBe('attribute_exists(id)');
    expect(command.input.UpdateExpression).toBe('SET title = :title');
    expect(command.input.ExpressionAttributeValues).toEqual({ ':title': 'あいうえお' });
    expect(command.input.ReturnValues).toBe('ALL_NEW');

    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(result.body ?? '')).toMatchObject({ title: 'あいうえお' });
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test('詳細の更新が成功すること', async () => {
    const body = JSON.stringify({ detail: 'かきくけこ' });
    const result = await updateTodo(mockClient, { ...baseEvent, body });

    const command = mockSend.mock.calls[0][0];

    expect(command.input.Key).toEqual({ userId: 'demo-user-id', id: '12345' });
    expect(command.input.ConditionExpression).toBe('attribute_exists(id)');
    expect(command.input.UpdateExpression).toBe('SET detail = :detail');
    expect(command.input.ExpressionAttributeValues).toEqual({ ':detail': 'かきくけこ' });
    expect(command.input.ReturnValues).toBe('ALL_NEW');

    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(result.body ?? '')).toMatchObject({ detail: 'かきくけこ' });
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test('タイトル、詳細両方の更新が成功すること', async () => {
    const body = JSON.stringify({ title: 'あいうえお', detail: 'かきくけこ' });
    const result = await updateTodo(mockClient, { ...baseEvent, body });

    const command = mockSend.mock.calls[0][0];

    expect(command.input.Key).toEqual({ userId: 'demo-user-id', id: '12345' });
    expect(command.input.ConditionExpression).toBe('attribute_exists(id)');
    expect(command.input.UpdateExpression).toBe('SET title = :title,detail = :detail');
    expect(command.input.ExpressionAttributeValues).toEqual({ ':title': 'あいうえお', ':detail': 'かきくけこ' });
    expect(command.input.ReturnValues).toBe('ALL_NEW');

    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(result.body ?? '')).toMatchObject({ title: 'あいうえお', detail: 'かきくけこ' });
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});

describe('完了日時の更新テスト', () => {
  beforeEach(() => {
    mockSend.mockClear();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-15T06:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('completed が true のとき completedAt を SET すること', async () => {
    mockSend.mockResolvedValueOnce({
      Attributes: {
        id: '12345',
        userId: demoUserObj.userId,
        title: 'テスト',
        createdAt: '2026-08-05T07:23:15.323Z',
        completedAt: '2026-10-15T06:00:00.000Z',
      },
    });
    const body = JSON.stringify({ completed: true });
    const result = await updateTodo(mockClient, { ...baseEvent, body });

    const command = mockSend.mock.calls[0][0];

    expect(command.input.UpdateExpression).toBe('SET completedAt = :completedAt');
    expect(command.input.ExpressionAttributeValues).toEqual({
      ':completedAt': '2026-10-15T06:00:00.000Z',
    });
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(result.body ?? '')).toMatchObject({
      completedAt: '2026-10-15T06:00:00.000Z',
    });
    expect(JSON.parse(result.body ?? '')).not.toHaveProperty('completed');
  });

  test('completed が false のとき completedAt を REMOVE すること', async () => {
    mockSend.mockResolvedValueOnce({
      Attributes: {
        id: '12345',
        userId: demoUserObj.userId,
        title: 'テスト',
        createdAt: '2026-08-05T07:23:15.323Z',
      },
    });
    const body = JSON.stringify({ completed: false });
    const result = await updateTodo(mockClient, { ...baseEvent, body });

    const command = mockSend.mock.calls[0][0];

    expect(command.input.UpdateExpression).toBe('REMOVE completedAt');
    expect(command.input.ExpressionAttributeValues).toBeUndefined();
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(result.body ?? '')).not.toHaveProperty('completedAt');
    expect(JSON.parse(result.body ?? '')).not.toHaveProperty('completed');
  });
});

describe('更新処理APIのエラーテスト', () => {
  beforeEach(() => {
    mockSend.mockClear();
  });
  test('パスパラメーターに id がない場合 404 エラーを表示すること', async () => {
    const event = {
      rawPath: '/todos/undefined',
      pathParameters: {},
      requestContext: { http: { method: 'PATCH' } },
    } as unknown as APIGatewayProxyEventV2WithJWTAuthorizer;
    const body = JSON.stringify({ title: 'あいうえお', detail: 'かきくけこ' });
    const result = await updateTodo(mockClient, { ...event, body });
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.body).toBe(toErrorBody(ErrorMessages.NOT_FOUND));
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('存在しない id が指定されていた場合 404 エラーを表示すること', async () => {
    mockSend.mockRejectedValueOnce(
      new ConditionalCheckFailedException({ message: 'The conditional request failed', $metadata: {} }),
    );
    const body = JSON.stringify({ title: 'あいうえお', detail: 'かきくけこ' });
    const result = await updateTodo(mockClient, { ...baseEvent, body });
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(result.body).toBe(toErrorBody(ErrorMessages.TODO_NOT_FOUND));
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test('body がない場合 400 エラーを表示すること', async () => {
    const body = undefined;
    const result = await updateTodo(mockClient, { ...baseEvent, body });
    expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(result.body).toBe(toErrorBody(ErrorMessages.BODY_REQUIRED));
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('不正な JSON の場合 400 エラーを返すこと', async () => {
    const result = await updateTodo(mockClient, { ...baseEvent, body: '{' });
    expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(result.body).toBe(toErrorBody(ErrorMessages.INVALID_JSON));
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('更新項目がない場合 400 エラーを返すこと', async () => {
    const result = await updateTodo(mockClient, { ...baseEvent, body: '{}' });
    expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(result.body).toBe(
      JSON.stringify({
        error: ErrorMessages.VALIDATION_FAILED.error,
        details: ['更新する項目を1つ以上指定してください'],
      }),
    );
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('title が空の場合 400 エラーを返すこと', async () => {
    const result = await updateTodo(mockClient, { ...baseEvent, body: '{"title":""}' });
    expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(result.body).toBe(
      JSON.stringify({ error: ErrorMessages.VALIDATION_FAILED.error, details: ['タイトルは必須です'] }),
    );
    expect(mockSend).not.toHaveBeenCalled();
  });
});
