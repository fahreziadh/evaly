import { and, eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { test } from '../../../lib/db/schema/test'

export async function checkTestOwner(testId: string, organizationId: string) {
  const testResponse = await db.query.test.findFirst({
    where: and(eq(test.id, testId), eq(test.organizationId, organizationId))
  })

  if (!testResponse) {
    throw new Error('Test not found')
  }

  return testResponse
}
