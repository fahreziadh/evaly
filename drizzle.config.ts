import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

import { env } from './src/lib/env'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema',
  dbCredentials: {
    url: env.DATABASE_URL
  },
  verbose: true,
  strict: true
})
