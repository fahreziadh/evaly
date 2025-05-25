import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '../env'
import * as schema from './schema'

const client = postgres(env.DATABASE_URL, { prepare: false })
const db = drizzle(client, {
  schema
  // logger: process.env.NODE_ENV === "development" ? true : false,
})

export default db
