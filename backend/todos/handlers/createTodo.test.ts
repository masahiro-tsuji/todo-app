import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ErrorMessages } from '../constants';
import { type CreateTodoRequestBody, HttpStatus } from '../types';
import { createTodo } from './createTodo';

const mockSend = jest.fn();
const mockClient = { send: mockSend } as never;

const baseEvent = {
  requestContext: { http: { method: 'POST' } },
  rawPath: '/todos',
} as APIGatewayProxyEventV2;

const toErrorBody = (message: (typeof ErrorMessages)[keyof typeof ErrorMessages]) =>
  JSON.stringify({ error: message.error, details: [message.detail] });

describe('todo作成APIのテスト', () => {
  beforeEach(() => {
    mockSend.mockClear();
  });

  test('パラメーターが正常な場合、作成に成功すること', async () => {
    const body: CreateTodoRequestBody = { title: 'テスト', description: '説明テスト' };
    const jsonBody = JSON.stringify(body);
    const res = await createTodo(mockClient, { ...baseEvent, body: jsonBody });
    const resBody = JSON.parse(res.body ?? '');
    expect(res.statusCode).toBe(HttpStatus.CREATED);
    expect(resBody.title).toBe('テスト');
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test('bodyがない場合、400エラーを返すこと', async () => {
    const res = await createTodo(mockClient, baseEvent);
    expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(res.body).toBe(toErrorBody(ErrorMessages.BODY_REQUIRED));
  });

  test('bodyが不正な場合、400エラーを返すこと', async () => {
    const res = await createTodo(mockClient, { ...baseEvent, body: '{' });
    expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(res.body).toBe(toErrorBody(ErrorMessages.INVALID_JSON));
  });

  test('bodyの必須パラメータがない場合、400エラーを返すこと', async () => {
    const res = await createTodo(mockClient, { ...baseEvent, body: '{"title":""}' });
    expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(res.body).toBe(
      JSON.stringify({ error: ErrorMessages.VALIDATION_FAILED.error, details: ['タイトルは必須です'] }),
    );
  });
});
