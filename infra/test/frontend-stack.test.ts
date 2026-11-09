import * as fs from 'node:fs';
import * as path from 'node:path';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { FrontendStack } from '../lib/frontend-stack';

const rewriteUrlPath = path.join(__dirname, '../cloudfront-functions/rewriteUrl.js');

type RewriteRequest = { uri: string };

const loadHandler = () => {
  const source = fs.readFileSync(rewriteUrlPath, 'utf8');
  return new Function(`${source}\nreturn handler;`)() as (event: { request: RewriteRequest }) => RewriteRequest;
};

const rewrite = (uri: string) => loadHandler()({ request: { uri } }).uri;

describe('URLの読み替え', () => {
  test.each([
    ['/list', '/list.html'],
    ['/list/', '/list.html'],
    ['/login', '/login.html'],
    ['/mfa-verify', '/mfa-verify.html'],
    ['/trash', '/trash.html'],
    ['/settings', '/settings.html'],
    ['/completed', '/completed.html'],
    ['/new-password', '/new-password.html'],
    ['/', '/index.html'],
  ])('%s を %s に読み替えること', (uri, expected) => {
    expect(rewrite(uri)).toBe(expected);
  });

  test.each(['/list.html', '/_next/static/chunks/main.js', '/favicon.ico'])('拡張子がある %s は変えないこと', (uri) => {
    expect(rewrite(uri)).toBe(uri);
  });
});

describe('CloudFrontの設定について', () => {
  const template = Template.fromStack(new FrontendStack(new App(), 'FrontendStack'));

  test('viewer request で URL を読み替えること', () => {
    template.hasResourceProperties('AWS::CloudFront::Function', {
      FunctionConfig: { Runtime: 'cloudfront-js-2.0' },
    });

    const distributions = template.findResources('AWS::CloudFront::Distribution');
    const distribution = Object.values(distributions)[0] as {
      Properties: {
        DistributionConfig: {
          DefaultCacheBehavior: { FunctionAssociations: { EventType: string }[] };
          CustomErrorResponses?: unknown;
        };
      };
    };

    expect(distribution.Properties.DistributionConfig.DefaultCacheBehavior.FunctionAssociations).toEqual([
      expect.objectContaining({ EventType: 'viewer-request' }),
    ]);
    expect(distribution.Properties.DistributionConfig.CustomErrorResponses).toBeUndefined();
  });
});
