import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import {
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfrontOrigins,
  RemovalPolicy,
  aws_s3 as s3,
} from 'aws-cdk-lib';
import type { Construct } from 'constructs';

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3の設定
    const bucket = new s3.Bucket(this, 'TodoWebSiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, // バケットへのパブリックアクセスを全て拒否
      publicReadAccess: false, // バケット内のオブジェクトのパブリックアクセスを拒否
      autoDeleteObjects: true, // スタック削除時にバケットも一緒に削除する
      removalPolicy: RemovalPolicy.DESTROY,
      enforceSSL: true, // httpリクエストを拒否
    });

    // S3 の OACの設定
    const s3Origin = cloudfrontOrigins.S3BucketOrigin.withOriginAccessControl(bucket, {
      // NOTE: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront_origins-readme.html#setting-up-oac-with-list-permission
      originAccessLevels: [cloudfront.AccessLevel.READ, cloudfront.AccessLevel.LIST],
    });

    // NOTE: 静的書き出しの実体は list.html。ブラウザの /list を viewer request で list.html に読み替える
    const rewriteUrl = new cloudfront.Function(this, 'RewriteUrl', {
      comment: '拡張子の無いパスを対応する .html に読み替える',
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(__dirname, '../cloudfront-functions/rewriteUrl.js'),
      }),
      runtime: cloudfront.FunctionRuntime.JS_2_0,
    });

    const distribution = new cloudfront.Distribution(this, 'TodoDistribution', {
      defaultBehavior: {
        origin: s3Origin, // S3 からファイルを取得する
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, // HTTP リクエストを HTTPS にリダイレクトする
        /**
         * 拡張子の無いパスを対応する .html に読み替える。
         * functionAssociations では、特定のイベントに対して特定の関数を適用
         * eventType は、VIEWER_REQUEST ではブラウザからのリクエスト時に関数を適用
         */
        functionAssociations: [{ function: rewriteUrl, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST }],
      },
      defaultRootObject: 'index.html',
    });

    new cdk.CfnOutput(this, 'WebSiteUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'フロントの公開 URL',
    });
    new cdk.CfnOutput(this, 'S3BucketName', { value: bucket.bucketName, description: 'S3バケット名' });
    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront ディストリビューション ID',
    });
  }
}
