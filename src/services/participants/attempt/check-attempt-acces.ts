import { and, eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { testAttempt } from '../../../lib/db/schema/test.attempt'

export async function checkAttemptAccess(attemptId: string, participantEmail: string) {
  const attempt = await db.query.testAttempt.findFirst({
    columns: {
      id: true,
      completedAt: true,
      testId: true
    },
    with: {
      test: {
        columns: {
          isPublished: true,
          finishedAt: true
        }
      }
    },
    where: and(
      eq(testAttempt.id, attemptId),
      eq(testAttempt.participantEmail, participantEmail)
    )
  })

  return attempt
}
