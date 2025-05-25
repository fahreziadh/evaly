import { AwsClient } from 'aws4fetch'

import { env } from './env'

export const R2_URL = `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`

export const client = new AwsClient({
  service: 's3',
  region: 'auto',
  accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY
})
