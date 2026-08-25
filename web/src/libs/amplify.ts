import { Amplify } from 'aws-amplify';

let configured = false;

export const configureAmplify = () => {
  if (configured) return;
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID as string,
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
        loginWith: { email: true },
      },
    },
  });

  configured = true;
};
