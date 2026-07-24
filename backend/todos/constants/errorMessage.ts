export type ApiErrorMessage = {
  error: string;
  detail: string;
};

export const ErrorMessages = {
  BODY_REQUIRED: {
    error: 'Request body is required',
    detail: 'リクエストボディが必要です',
  },
  INVALID_JSON: {
    error: 'Invalid JSON format',
    detail: 'JSONの形式が不正です',
  },
  NOT_FOUND: {
    error: 'Not Found',
    detail: 'リソースが見つかりません',
  },
  INTERNAL_SERVER_ERROR: {
    error: 'Internal Server Error',
    detail: 'サーバーエラーが発生しました',
  },
  VALIDATION_FAILED: {
    error: 'Validation failed',
    detail: '入力内容に誤りがあります',
  },
} as const satisfies Record<string, ApiErrorMessage>;
