import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';

import type { Construct } from 'constructs';

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 認証設定
    const userPool = new cognito.UserPool(this, 'UserPool', {
      signInAliases: { email: true }, // emailでログイン
      autoVerify: { email: true }, // 登録時に確認メールを送信
      keepOriginal: { email: true }, // 変更前のメールを保持
      mfa: cognito.Mfa.OPTIONAL, // MFAは任意で設定
      mfaSecondFactor: { sms: false, otp: true }, // MFAを利用する場合、ワンタイムパスワードを使用
      signInPolicy: { allowedFirstAuthFactors: { password: true } }, // 任意でパスワードログインを許可
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY, // パスワード忘れ時はメール
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireSymbols: false,
        requireUppercase: false,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // スタック削除と同時に削除
    });

    // Webで使えるようにする設定
    const userPoolClient = userPool.addClient('WebClient', {
      authFlows: { userPassword: true, userSrp: true }, // email + パスワードでログイン、SRPでログイン
      generateSecret: false, //ブラウザアプリで secret を持たない
      accessTokenValidity: cdk.Duration.hours(1),
      idTokenValidity: cdk.Duration.hours(1),
      refreshTokenValidity: cdk.Duration.days(1),
    });

    // NOTE: this で代入しないと、infra.ts で undefined になる
    this.userPool = userPool;
    this.userPoolClient = userPoolClient;

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      description: 'Cognito ユーザープール ID（フロントの認証設定用）',
    });
    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: 'Web 用アプリクライアント ID（フロントの認証設定用）',
    });
    new cdk.CfnOutput(this, 'UserPoolArn', {
      value: userPool.userPoolArn,
      description: 'JWT 認可用ユーザープール ARN（API スタックで参照）',
    });
  }
}
