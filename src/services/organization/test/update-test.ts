import { and, eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { test } from '../../../lib/db/schema'
import { UpdateTest } from '../../../types/test'

export async function updateTest({
  id,
  data,
  organizationId
}: {
  id: string
  data: UpdateTest
  organizationId: string
}) {
  const updatedTest = await db
    .update(test)
    .set(data)
    .where(and(eq(test.id, id), eq(test.organizationId, organizationId)))
    .returning()

  return updatedTest[0]
}
