import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "staging", "test"])
    .default("development"),
  VITE_API_URL: z.string().url(),
  VITE_APP_URL: z.string().url(),
  VITE_COGNITO_USER_POOL_CLIENT_ID: z.string(),
  VITE_COGNITO_USER_POOL_ID: z.string(),
  VITE_COGNITO_DOMAIN: z.string().url(),
});

type EnvConfig = z.infer<typeof envSchema>;

function validateEnv(): EnvConfig {
  try {
    return envSchema.parse({
      NODE_ENV: import.meta.env.MODE,
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_APP_URL: import.meta.env.VITE_APP_URL,
      VITE_COGNITO_USER_POOL_CLIENT_ID: import.meta.env
        .VITE_COGNITO_USER_POOL_CLIENT_ID,
      VITE_COGNITO_USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      VITE_COGNITO_DOMAIN: import.meta.env.VITE_COGNITO_DOMAIN,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:", error.errors);
    }
    throw new Error("Invalid environment variables");
  }
}

export const env = validateEnv();

export const isDevelopment = env.NODE_ENV === "development";
export const isStaging = env.NODE_ENV === "staging";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
