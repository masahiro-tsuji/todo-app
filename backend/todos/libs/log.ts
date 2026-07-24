type ErrorLogJson = { requestId: string; message: string; error?: unknown; userId?: string };
/** CloudWatch用のログ作成
 * @todo 後にLambda Powertools Logger等を検討
 */
export const createErrorJsonLog = ({ requestId, message, error, userId }: ErrorLogJson) => {
  return JSON.stringify({ level: 'error', requestId, message, userId, error });
};
