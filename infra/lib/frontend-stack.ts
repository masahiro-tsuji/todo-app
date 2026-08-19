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

    const distribution = new cloudfront.Distribution(this, 'TodoDistribution', {
      defaultBehavior: { origin: s3Origin, viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS },
      defaultRootObject: 'index.html',
      // NOTE: アドレスバーで /list とした時のエラー防止
      errorResponses: [
        {
          httpStatus: 404, // S3 が 404 を返したとき
          responseHttpStatus: 200, // 200 を返すようにする
          responsePagePath: '/index.html', // index.html を返す
        },
      ],
    });

    new cdk.CfnOutput(this, 'WebSiteUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'フロントの公開 URL',
    });
    new cdk.CfnOutput(this, 'S3BucketName', { value: bucket.bucketName, description: 'S3バケット名' });
  }
}
