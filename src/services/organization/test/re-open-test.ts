import db from '@/lib/db'
import { question, test, testSection } from '@/lib/db/schema'

import { InsertQuestion } from '@/types/question'

export async function duplicateTest(testId: string, organizationId: string) {
  // Duplicate everything from the original test
  const currentTest = await db.query.test.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, testId)
    },
    with: {
      testSections: {
        with: {
          question: {
            orderBy(fields, operators) {
              return operators.asc(fields.order)
            }
          }
        },
        orderBy(fields, operators) {
          return operators.asc(fields.order)
        }
      }
    }
  })

  // Create a new test with the same data
  const createNewTest = await db
    .insert(test)
    .values({
      ...currentTest,
      id: undefined, // Let the database generate the id
      organizationId: organizationId,
      createdByOrganizerId: currentTest?.createdByOrganizerId || '',
      isPublished: false,
      finishedAt: null,
      access: 'public',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      heldAt: null
    })
    .returning()

  const newTestCreated = createNewTest[0]

  if (!newTestCreated) {
    throw new Error('Failed to create a new test')
  }

  let newTestOrder = 1

  // Duplicate the test sections along with the questions
  for await (const section of currentTest?.testSections || []) {
    if (section.deletedAt) {
      continue
    }

    const createNewTestSection = await db
      .insert(testSection)
      .values({
        ...section,
        id: undefined,
        testId: newTestCreated.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        order: newTestOrder
      })
      .returning()

    const newTestSection = createNewTestSection[0]

    if (!newTestSection) {
      throw new Error('Failed to create a new test section')
    }

    newTestOrder++

    // Duplicate the questions
    const currentSectionQuestions = section.question
    const newQuestions: InsertQuestion[] = []

    for (const question of currentSectionQuestions) {
      if (question.deletedAt) {
        continue
      }

      newQuestions.push({
        ...question,
        id: undefined,
        referenceId: newTestSection.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null
      })
    }

    if (newQuestions.length > 0) {
      // Create the questions
      await db.insert(question).values(newQuestions)
    }
  }

  return newTestCreated
}
