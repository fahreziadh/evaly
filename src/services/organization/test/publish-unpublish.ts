import { and, eq } from 'drizzle-orm/sql'

import db from '../../../lib/db'
import { test } from '../../../lib/db/schema'

export async function publishUnpublishTest(
  testId: string,
  isPublished: boolean,
  organizationId: string
) {
  const updatedTest = await db
    .update(test)
    .set({
      isPublished,
      heldAt: isPublished ? new Date().toISOString() : undefined
    })
    .where(and(eq(test.id, testId), eq(test.organizationId, organizationId)))
    .returning()
  return updatedTest[0]
}
