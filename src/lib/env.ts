import { z } from 'zod'

// Define the environment schema
const envSchema = z.object({
  DATABASE_URL: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  BETTER_AUTH_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_CDN_URL: z.string(),
  CLOUDFLARE_BUCKET_NAME: z.string(),
  EVALY_AWS_ACCESS_KEY_ID: z.string(),
  EVALY_AWS_SECRET_ACCESS_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string()
})

// Parse the environment variables
export const env = envSchema.parse(process.env)
