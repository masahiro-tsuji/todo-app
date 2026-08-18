// モジュールをモック化
jest.mock('./handlers/getTodos');
jest.mock('./handlers/createTodo');

import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler } from '.';
import { ErrorMessages } from './constants';
// モックをimport
import { createTodo } from './handlers/createTodo';
import { getTodos } from './handlers/getTodos';
import { HttpStatus } from './types';

const todoHandler = async (method: 'GET' | 'POST' | 'PUT', path: string = '/todos') =>
  await handler({ rawPath: path, requestContext: { http: { method } } } as APIGatewayProxyEventV2);

describe('GET: /todos のルーティングテストについて', () => {
  beforeEach(() => {
    jest.mocked(getTodos).mockResolvedValue({ statusCode: HttpStatus.OK, body: '[]' });
    jest.mocked(createTodo).mockResolvedValue({ statusCode: HttpStatus.CREATED, body: '{}' });
  });
  test('getTodosが呼ばれること', async () => {
    const res = await todoHandler('GET');
    expect(getTodos).toHaveBeenCalledTimes(1);
    expect(createTodo).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(HttpStatus.OK);
  });

  test('/todo以外のパスの時、404エラーを返すこと', async () => {
    // GETメソッド時
    const getMethodResponse = await todoHandler('GET', '/unknown');
    expect(JSON.parse(getMethodResponse.body ?? '')).toEqual(expect.objectContaining({ error: 'Not Found' }));
    expect(getMethodResponse.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(getTodos).not.toHaveBeenCalled();
  });

  test('throwした時 500エラーを返すこと', async () => {
    jest.mocked(getTodos).mockRejectedValue(new Error('DB error'));
    const res = await todoHandler('GET');
    expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(res.body ?? '')).toEqual(
      expect.objectContaining({ error: ErrorMessages.INTERNAL_SERVER_ERROR.error }),
    );
    expect(createTodo).not.toHaveBeenCalled();
  });
});

describe('POST: /todos のルーティングテストについて', () => {
  beforeEach(() => {
    jest.mocked(getTodos).mockResolvedValue({ statusCode: HttpStatus.OK, body: '[]' });
    jest.mocked(createTodo).mockResolvedValue({ statusCode: HttpStatus.CREATED, body: '{}' });
  });

  test('createTodosが呼ばれること', async () => {
    const res = await todoHandler('POST');
    expect(createTodo).toHaveBeenCalledTimes(1);
    expect(getTodos).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(HttpStatus.CREATED);
  });

  test('/todo以外のパスの時、404エラーを返すこと', async () => {
    // POSTメソッド時
    const postMethodResponse = await todoHandler('POST', '/unknown');
    expect(JSON.parse(postMethodResponse.body ?? '')).toEqual(expect.objectContaining({ error: 'Not Found' }));
    expect(postMethodResponse.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(createTodo).not.toHaveBeenCalled();
  });

  test('throwした時 500エラーを返すこと', async () => {
    jest.mocked(createTodo).mockRejectedValue(new Error('DB error'));
    const res = await todoHandler('POST');
    expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(res.body ?? '')).toEqual(
      expect.objectContaining({ error: ErrorMessages.INTERNAL_SERVER_ERROR.error }),
    );
    expect(getTodos).not.toHaveBeenCalled();
  });
});
