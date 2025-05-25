import { and, eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { testInvitation } from '../../../lib/db/schema'

export async function deleteInvitationTest(testId: string, email: string) {
  const res = await db
    .delete(testInvitation)
    .where(and(eq(testInvitation.testId, testId), eq(testInvitation.email, email)))
  return res
}
