import { eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { testAttempt } from '../../../lib/db/schema/test.attempt'

export async function getAttemptById(attemptId: string) {
  const attempt = await db.query.testAttempt.findFirst({
    with: {
      testSection: {
        with: {
          question: {
            columns: {
              id: true,
              allowMultipleAnswers: true,
              options: true,
              order: true,
              question: true,
              type: true
            },
            where(fields, { isNull }) {
              return isNull(fields.deletedAt)
            },
            orderBy(fields, { asc }) {
              return asc(fields.order)
            }
          }
        }
      }
    },
    where: eq(testAttempt.id, attemptId)
  })

  return attempt
}
