// biome-ignore lint/correctness/noUnusedVariables: CloudFront Functions は handler をエントリとして呼ぶ
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri !== '/' && uri.endsWith('/')) {
    uri = uri.slice(0, -1);
  }

  if (!uri.includes('.')) {
    uri += uri === '/' ? 'index.html' : '.html';
  }

  request.uri = uri;
  return request;
}
