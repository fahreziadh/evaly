import { eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { test } from '../../../lib/db/schema'

export async function deleteTest(testId: string) {
  const response = await db
    .update(test)
    .set({
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    .where(eq(test.id, testId))
    .returning()
  return response[0]
}
