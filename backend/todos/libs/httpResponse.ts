import type z from 'zod';
import { type ApiErrorMessage, ErrorMessages } from '../constants';
import { HttpStatus, type HttpStatusCode } from '../types';

type ResponseHeaders = Record<string, string>;

/** @return レスポンス用のJSONオブジェクト */
export const createJsonResponse = (statusCode: HttpStatusCode, body: unknown, headers?: ResponseHeaders) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', ...headers },
  body: JSON.stringify(body),
});

/**
 * Jsonのエラーオブジェクトを作成
 * @returns Jsonのエラーレスポンス
 */
export const createErrorResponse = (statusCode: HttpStatusCode, message: ApiErrorMessage) => {
  return createJsonResponse(statusCode, { error: message.error, details: [message.detail] });
};

/**
 * zodのバリデーションエラー
 * @return Jsonのエラーレスポンス
 */
export const createZodErrorResponse = (issues: z.core.$ZodIssue[]) => {
  return createJsonResponse(HttpStatus.BAD_REQUEST, {
    error: ErrorMessages.VALIDATION_FAILED.error,
    details: issues.map((i) => i.message),
  });
};
