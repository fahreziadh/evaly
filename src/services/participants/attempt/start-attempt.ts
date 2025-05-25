import db from '../../../lib/db'
import { testAttempt } from '../../../lib/db/schema'
import { getTestById } from '../test/get-test-by-id'
import { getAttempts } from './get-attempts-by-test-id'

export async function startAttempt({
  testId,
  testSectionId,
  email
}: {
  testId: string
  testSectionId: string
  email: string
}) {
  // Check if the test is published or not return error if not published
  const test = await getTestById({
    id: testId,
    email: email
  })

  // Get the list of test section
  if (!test.testSections) {
    return {
      error: {
        code: 404,
        message: 'Test section not found'
      }
    }
  }

  // If Test is not published, return error
  if (!test.isPublished) {
    return {
      error: {
        code: 403,
        message: 'Test is not published'
      }
    }
  }

  // If Test is finished, return error
  if (test.finishedAt) {
    return {
      error: {
        code: 403,
        message: 'Test is finished'
      }
    }
  }
  // Get the test section data that targetted
  const testSection = test.testSections.find(section => section.id === testSectionId)

  if (!testSection) {
    return {
      error: {
        code: 404,
        message: 'Test section not found'
      }
    }
  }

  // Get all attempts for the test
  const attempts = await getAttempts({
    testId: testId,
    email: email
  })

  // Check if the existing attempt is already completed
  if (
    attempts.find(
      attempt => attempt.testSectionId === testSectionId && attempt.completedAt
    )
  ) {
    return {
      error: {
        code: 403,
        message: 'You have already completed this section'
      }
    }
  }

  // If the section is not the first section, check if the previous section is completed or not
  if (
    test.sectionSelectionMode === 'sequential' &&
    testSection.order &&
    testSection.order > 1
  ) {
    // Check if previous section is completed or not, test.testSection is ordered by '.order'
    const previousSection = test.testSections.find(
      section =>
        section.order && testSection.order && section.order < testSection?.order
    )

    // If there is no previous section, return error
    if (!previousSection) {
      return {
        error: {
          code: 403,
          message: 'You must complete the previous section before starting this one'
        }
      }
    }

    // Check if the previous section is completed
    if (
      !attempts.find(
        attempt => attempt.testSectionId === previousSection.id && attempt.completedAt
      )
    ) {
      return {
        error: {
          code: 403,
          message: 'You must complete the previous section before starting this one'
        }
      }
    }
  }

  // Create the attempt
  const attempt = await db
    .insert(testAttempt)
    .values({
      participantEmail: email,
      testId: testId,
      testSectionId: testSectionId,
      startedAt: new Date().toISOString()
    })
    .onConflictDoUpdate({
      target: [
        testAttempt.participantEmail,
        testAttempt.testId,
        testAttempt.testSectionId
      ],
      set: {
        updatedAt: new Date().toISOString()
      }
    })
    .returning()

  return {
    data: attempt[0]
  }
}
