import { and, eq, isNull } from 'drizzle-orm'

import db from '../../../lib/db'
import { test } from '../../../lib/db/schema'

export async function getTestById({
  id,
  organizationId
}: {
  id: string
  organizationId: string
}) {
  const testResult = await db.query.test.findFirst({
    where: and(
      eq(test.id, id),
      eq(test.organizationId, organizationId),
      isNull(test.deletedAt)
    )
  })

  return testResult
}
