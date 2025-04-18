import { type ResourcesConfig } from "aws-amplify";
import { env } from "../env/env";

export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: env.VITE_COGNITO_USER_POOL_CLIENT_ID,
      userPoolId: env.VITE_COGNITO_USER_POOL_ID,
      loginWith: {
        oauth: {
          domain: env.VITE_COGNITO_DOMAIN.replace("https://", ""),
          scopes: ["openid", "email"],
          redirectSignIn: [env.VITE_APP_URL],
          redirectSignOut: [env.VITE_APP_URL],
          responseType: "code",
        },
      },
    },
  },
};
