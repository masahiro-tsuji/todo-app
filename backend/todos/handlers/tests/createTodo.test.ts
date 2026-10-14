import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';
import { demoUserObj, ErrorMessages, toErrorBody } from '../../constants';
import { type CreateTodoRequestBody, HttpStatus } from '../../types';
import { createTodo } from '../createTodo';

const mockSend = jest.fn();
const mockClient = { send: mockSend } as never;

const baseEvent = {
  requestContext: { http: { method: 'POST' }, authorizer: { jwt: { claims: { sub: demoUserObj.userId } } } },
  rawPath: '/todos',
} as unknown as APIGatewayProxyEventV2WithJWTAuthorizer;

describe('todo作成APIのテスト', () => {
  beforeEach(() => {
    mockSend.mockClear();
  });

  test('パラメーターが正常な場合、作成に成功すること', async () => {
    const body: CreateTodoRequestBody = { title: 'テスト', detail: '説明テスト' };
    const jsonBody = JSON.stringify(body);
    const res = await createTodo(mockClient, { ...baseEvent, body: jsonBody });
    const resBody = JSON.parse(res.body ?? '');
    expect(res.statusCode).toBe(HttpStatus.CREATED);
    expect(resBody.title).toBe('テスト');
    expect(resBody.detail).toBe('説明テスト');
    expect(resBody.completed).toBe(false);
    expect(resBody).not.toHaveProperty('completedAt');
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0][0].input.Item.completed).toBe(false);
    expect(mockSend.mock.calls[0][0].input.Item).not.toHaveProperty('completedAt');
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
