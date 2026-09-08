// モジュールをモック化
jest.mock('./handlers/getTodos');
jest.mock('./handlers/getTrashTodos');
jest.mock('./handlers/createTodo');
jest.mock('./handlers/restoreTodo');
jest.mock('./handlers/permanentDeleteTodo');
jest.mock('./handlers/softDeleteTodo');
jest.mock('./handlers/updateTodo');

import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';
import { handler } from '.';
import { demoUserObj, ErrorMessages } from './constants';
import { createTodo } from './handlers/createTodo';
import { getTodos } from './handlers/getTodos';
import { getTrashTodos } from './handlers/getTrashTodos';
import { permanentDeleteTodo } from './handlers/permanentDeleteTodo';
import { restoreTodo } from './handlers/restoreTodo';
import { softDeleteTodo } from './handlers/softDeleteTodo';
import { updateTodo } from './handlers/updateTodo';
import { HttpStatus } from './types';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const todoHandler = async (method: HttpMethod, path: string = '/todos') =>
  await handler({
    rawPath: path,
    requestContext: { http: { method }, authorizer: { jwt: { claims: { sub: demoUserObj.userId } } } },
  } as unknown as APIGatewayProxyEventV2WithJWTAuthorizer);

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

describe('GET: /todos/trash のルーティングテストについて', () => {
  beforeEach(() => {
    jest.mocked(getTodos).mockResolvedValue({ statusCode: HttpStatus.OK, body: '[]' });
    jest.mocked(getTrashTodos).mockResolvedValue({ statusCode: HttpStatus.OK, body: '[]' });
    jest.mocked(createTodo).mockResolvedValue({ statusCode: HttpStatus.CREATED, body: '{}' });
  });

  test('getTrashTodosが呼ばれること', async () => {
    const res = await todoHandler('GET', '/todos/trash');
    expect(getTrashTodos).toHaveBeenCalledTimes(1);
    expect(getTodos).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(HttpStatus.OK);
  });

  test('/todos/trash 以外のパスの時、404エラーを返すこと', async () => {
    const res = await todoHandler('GET', '/todos/unknown-id');
    expect(JSON.parse(res.body ?? '')).toEqual(expect.objectContaining({ error: 'Not Found' }));
    expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(getTrashTodos).not.toHaveBeenCalled();
  });

  test('POST /todos/trash では getTrashTodos は呼ばれないこと', async () => {
    const res = await todoHandler('POST', '/todos/trash');
    expect(JSON.parse(res.body ?? '')).toEqual(expect.objectContaining({ error: 'Not Found' }));
    expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(getTrashTodos).not.toHaveBeenCalled();
  });

  test('throwした時 500エラーを返すこと', async () => {
    jest.mocked(getTrashTodos).mockRejectedValue(new Error('DB error'));
    const res = await todoHandler('GET', '/todos/trash');
    expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(res.body ?? '')).toEqual(
      expect.objectContaining({ error: ErrorMessages.INTERNAL_SERVER_ERROR.error }),
    );
    expect(getTodos).not.toHaveBeenCalled();
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

describe('POST: /todos/{id}/restore のルーティングテストについて', () => {
  beforeEach(() => {
    jest.mocked(restoreTodo).mockResolvedValue({ statusCode: HttpStatus.OK, body: '{}' });
  });

  test('restoreTodoが呼ばれること', async () => {
    const res = await todoHandler('POST', '/todos/12345/restore');
    expect(restoreTodo).toHaveBeenCalledTimes(1);
    expect(softDeleteTodo).not.toHaveBeenCalled();
    expect(getTrashTodos).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(HttpStatus.OK);
  });

  test('/restore で終わらないパスの時、404エラーを返すこと', async () => {
    const res = await todoHandler('POST', '/todos/12345');
    expect(JSON.parse(res.body ?? '')).toEqual(expect.objectContaining({ error: 'Not Found' }));
    expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(restoreTodo).not.toHaveBeenCalled();
  });

  test('throwした時 500エラーを返すこと', async () => {
    jest.mocked(restoreTodo).mockRejectedValue(new Error('DB error'));
    const res = await todoHandler('POST', '/todos/12345/restore');
    expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(res.body ?? '')).toEqual(
      expect.objectContaining({ error: ErrorMessages.INTERNAL_SERVER_ERROR.error }),
    );
  });
});

describe('DELETE: /todos/{id}/permanent-delete のルーティングテストについて', () => {
  beforeEach(() => {
    jest.mocked(permanentDeleteTodo).mockResolvedValue({ statusCode: HttpStatus.OK, body: '{}' });
  });

  test('permanentDeleteTodoが呼ばれること', async () => {
    const res = await todoHandler('DELETE', '/todos/12345/permanent-delete');
    expect(permanentDeleteTodo).toHaveBeenCalledTimes(1);
    expect(softDeleteTodo).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(HttpStatus.OK);
  });

  test('throwした時 500エラーを返すこと', async () => {
    jest.mocked(permanentDeleteTodo).mockRejectedValue(new Error('DB error'));
    const res = await todoHandler('DELETE', '/todos/12345/permanent-delete');
    expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(res.body ?? '')).toEqual(
      expect.objectContaining({ error: ErrorMessages.INTERNAL_SERVER_ERROR.error }),
    );
    expect(softDeleteTodo).not.toHaveBeenCalled();
  });
});

describe('DELETE: /todos/{id} のルーティングテストについて', () => {
  beforeEach(() => {
    jest.mocked(softDeleteTodo).mockResolvedValue({ statusCode: HttpStatus.OK, body: '{}' });
  });

  test('softDeleteTodoが呼ばれること', async () => {
    const res = await todoHandler('DELETE', '/todos/12345');
    expect(softDeleteTodo).toHaveBeenCalledTimes(1);
    expect(permanentDeleteTodo).not.toHaveBeenCalled();
    expect(updateTodo).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(HttpStatus.OK);
  });

  test('/permanent-delete で終わる DELETE では softDeleteTodo は呼ばれないこと', async () => {
    jest.mocked(permanentDeleteTodo).mockResolvedValue({ statusCode: HttpStatus.OK, body: '{}' });
    await todoHandler('DELETE', '/todos/12345/permanent-delete');
    expect(softDeleteTodo).not.toHaveBeenCalled();
    expect(permanentDeleteTodo).toHaveBeenCalledTimes(1);
  });

  test('throwした時 500エラーを返すこと', async () => {
    jest.mocked(softDeleteTodo).mockRejectedValue(new Error('DB error'));
    const res = await todoHandler('DELETE', '/todos/12345');
    expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(res.body ?? '')).toEqual(
      expect.objectContaining({ error: ErrorMessages.INTERNAL_SERVER_ERROR.error }),
    );
    expect(permanentDeleteTodo).not.toHaveBeenCalled();
  });
});

describe('PATCH: /todos/{id} のルーティングテストについて', () => {
  beforeEach(() => {
    jest.mocked(updateTodo).mockResolvedValue({ statusCode: HttpStatus.OK, body: '{}' });
  });

  test('updateTodoが呼ばれること', async () => {
    const res = await todoHandler('PATCH', '/todos/12345');
    expect(updateTodo).toHaveBeenCalledTimes(1);
    expect(restoreTodo).not.toHaveBeenCalled();
    expect(softDeleteTodo).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(HttpStatus.OK);
  });

  test('/todo以外のパスの時、404エラーを返すこと', async () => {
    const res = await todoHandler('PATCH', '/unknown');
    expect(JSON.parse(res.body ?? '')).toEqual(expect.objectContaining({ error: 'Not Found' }));
    expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(updateTodo).not.toHaveBeenCalled();
  });

  test('throwした時 500エラーを返すこと', async () => {
    jest.mocked(updateTodo).mockRejectedValue(new Error('DB error'));
    const res = await todoHandler('PATCH', '/todos/12345');
    expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(res.body ?? '')).toEqual(
      expect.objectContaining({ error: ErrorMessages.INTERNAL_SERVER_ERROR.error }),
    );
    expect(restoreTodo).not.toHaveBeenCalled();
  });
});
