import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';
import { demoUserObj } from '../../constants';
import { HttpStatus } from '../../types';
import { getTrashTodos } from '../getTrashTodos';

const mockSend = jest.fn();
const mockClient = { send: mockSend } as never;

const baseEvent = {
  requestContext: { http: { method: 'GET' }, authorizer: { jwt: { claims: { sub: demoUserObj.userId } } } },
  rawPath: '/todos/trash',
} as unknown as APIGatewayProxyEventV2WithJWTAuthorizer;

describe('ゴミ箱一覧取得のテスト', () => {
  beforeEach(() => {
    mockSend.mockClear();
  });

  test('ユーザーに紐づくゴミ箱一覧のみを取得すること', async () => {
    mockSend.mockReturnValue({
      Items: [
        {
          userId: demoUserObj.userId,
          id: '1',
          title: 'A',
          createdAt: '2026-01-01T09:00:00.000Z',
          deletedAt: '2026-01-10T09:00:00.000Z',
        },
        {
          userId: demoUserObj.userId,
          id: '2',
          title: 'B',
          createdAt: '2026-01-02T09:00:00.000Z',
          deletedAt: '2026-01-11T09:00:00.000Z',
        },
      ],
    });
    const response = await getTrashTodos(mockClient, baseEvent);
    const responseBody = JSON.parse(response?.body ?? '');
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          ExpressionAttributeValues: { ':userId': 'demo-user-id' },
          FilterExpression: 'attribute_exists(deletedAt)',
        }),
      }),
    );
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(responseBody[0].userId).toBe(demoUserObj.userId);
    expect(responseBody[1].userId).toBe(demoUserObj.userId);
  });

  test('ゴミ箱一覧を deletedAt の降順で取得すること', async () => {
    mockSend.mockReturnValue({
      Items: [
        {
          userId: demoUserObj.userId,
          id: '1',
          title: 'A',
          createdAt: '2026-01-01T09:00:00.000Z',
          deletedAt: '2026-01-10T09:00:00.000Z',
        },
        {
          userId: demoUserObj.userId,
          id: '2',
          title: 'B',
          createdAt: '2026-01-02T09:00:00.000Z',
          deletedAt: '2026-01-11T09:00:00.000Z',
        },
      ],
    });
    const response = await getTrashTodos(mockClient, baseEvent);
    const responseBody = JSON.parse(response?.body ?? '');
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(responseBody[0].deletedAt).toBe('2026-01-11T09:00:00.000Z');
    expect(responseBody[1].deletedAt).toBe('2026-01-10T09:00:00.000Z');
  });

  test('ゴミ箱が空でも取得に成功する', async () => {
    mockSend.mockReturnValue({ Items: [] });
    const response = await getTrashTodos(mockClient, baseEvent);
    const responseBody = JSON.parse(response?.body ?? '');
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(responseBody).toHaveLength(0);
  });
});
