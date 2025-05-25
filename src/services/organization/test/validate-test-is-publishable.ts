import { and, eq, isNull } from 'drizzle-orm'

import db from '../../../lib/db'
import { question, testSection } from '../../../lib/db/schema'
import { getInvitationListTest } from './get-invitation-list-test'
import { getTestById } from './get-test-by-id'

export type ValidationIssue = {
  code: string
  message: string
}

export type CheckStatus = 'ok' | 'warning' | 'error'

export type CheckItem = {
  id: string
  title: string
  status: CheckStatus
  message: string
}

export type TestPublishabilityResult = {
  isPublishable: boolean
  checklist: CheckItem[]
  summary: {
    title: string
    description: string | null
    type: string
    access: string
    totalSections: number
    totalQuestions: number
    totalDuration: number // in minutes
    totalParticipants: number
    scheduledDate: string | null
    sections: Array<{
      id: string
      title: string
      questionCount: number
      duration: number
    }>
  } | null
}

export async function validateTestIsPublishable(
  testId: string,
  organizationId: string
): Promise<TestPublishabilityResult> {
  const test = await getTestById({ id: testId, organizationId })

  if (!test) {
    return {
      isPublishable: false,
      checklist: [
        {
          id: 'test_exists',
          title: 'Test exists',
          status: 'error',
          message: 'Test not found'
        }
      ],
      summary: null
    }
  }

  const checklist: CheckItem[] = []
  let hasErrors = false

  // Check if title is set
  if (!test.title || test.title.trim() === '') {
    checklist.push({
      id: 'title',
      title: 'Test title',
      status: 'error',
      message: 'Test title is required'
    })
    hasErrors = true
  } else {
    checklist.push({
      id: 'title',
      title: 'Test title',
      status: 'ok',
      message: `Title: "${test.title}"`
    })
  }

  // Check if description is set
  if (!test.description || test.description.trim() === '') {
    checklist.push({
      id: 'description',
      title: 'Test description',
      status: 'warning',
      message: 'Adding a description is recommended'
    })
  } else {
    checklist.push({
      id: 'description',
      title: 'Test description',
      status: 'ok',
      message: 'Description is set'
    })
  }

  // Check test type
  checklist.push({
    id: 'type',
    title: 'Test type',
    status: 'ok',
    message: `${test.type === 'live' ? 'Live test' : 'Self-paced test'}`
  })

  // Get test sections
  const testSections = await db.query.testSection.findMany({
    where: and(eq(testSection.testId, testId), isNull(testSection.deletedAt))
  })

  // Check if test has sections
  if (testSections.length === 0) {
    checklist.push({
      id: 'sections',
      title: 'Test sections',
      status: 'error',
      message: 'Test must have at least one section'
    })
    hasErrors = true
  } else {
    checklist.push({
      id: 'sections',
      title: 'Test sections',
      status: 'ok',
      message: `${testSections.length} section(s) created`
    })

    // Check if each section has a title
    const sectionsWithoutTitle = testSections.filter(
      section => !section.title || section.title.trim() === ''
    )
    if (sectionsWithoutTitle.length > 0) {
      // checklist.push({
      //     id: "section_titles",
      //     title: "Section titles",
      //     status: "warning",
      //     message: `${sectionsWithoutTitle.length} section(s) are missing a title`
      // });
    } else {
      // checklist.push({
      //     id: "section_titles",
      //     title: "Section titles",
      //     status: "ok",
      //     message: "All sections have titles"
      // });
    }
  }

  // Get invitations if test is invite-only
  let invitations = []
  if (test.access === 'invite-only') {
    invitations = await getInvitationListTest(testId)

    if (invitations.length === 0) {
      checklist.push({
        id: 'invitations',
        title: 'Participant invitations',
        status: 'error',
        message: 'Invite-only test must have at least one participant invited'
      })
      hasErrors = true
    } else {
      checklist.push({
        id: 'invitations',
        title: 'Participant invitations',
        status: 'ok',
        message: `${invitations.length} participant(s) invited`
      })
    }
  } else {
    checklist.push({
      id: 'access',
      title: 'Test access',
      status: 'ok',
      message: `Access: ${test.access || 'public'}`
    })
  }

  // Check if test has a scheduled date for live tests
  if (test.type === 'live') {
    if (!test.heldAt) {
      checklist.push({
        id: 'scheduled_date',
        title: 'Scheduled date',
        status: 'error',
        message: 'Live test must have a scheduled date'
      })
      hasErrors = true
    } else {
      const scheduledDate = new Date(test.heldAt)
      checklist.push({
        id: 'scheduled_date',
        title: 'Scheduled date',
        status: 'ok',
        message: `Scheduled for: ${scheduledDate.toLocaleString()}`
      })
    }
  }

  // Build section details with question counts
  const sectionDetails = []
  let totalQuestions = 0
  let totalDuration = 0
  let sectionsWithoutQuestions = 0

  for (const section of testSections) {
    const questions = await db.query.question.findMany({
      where: and(eq(question.referenceId, section.id), isNull(question.deletedAt))
    })

    if (questions.length === 0) {
      sectionsWithoutQuestions++
    }

    totalQuestions += questions.length
    totalDuration += section.duration || 0

    sectionDetails.push({
      id: section.id,
      title: section.title || 'Untitled Section',
      questionCount: questions.length,
      duration: section.duration || 0
    })
  }

  // Check if all sections have questions
  if (sectionsWithoutQuestions > 0) {
    checklist.push({
      id: 'section_questions',
      title: 'Section questions',
      status: 'error',
      message: `${sectionsWithoutQuestions} section(s) have no questions`
    })
    hasErrors = true
  } else if (testSections.length > 0) {
    checklist.push({
      id: 'section_questions',
      title: 'Section questions',
      status: 'ok',
      message: `${totalQuestions} question(s) across all sections`
    })
  }

  // Check total duration
  if (totalDuration === 0 && testSections.length > 0) {
    // checklist.push({
    //     id: "duration",
    //     title: "Test duration",
    //     status: "warning",
    //     message: "No time limit set for sections. Participants can complete the test at their own pace."
    // });
  } else if (testSections.length > 0) {
    // checklist.push({
    //     id: "duration",
    //     title: "Test duration",
    //     status: "ok",
    //     message: `Total duration: ${totalDuration} minutes`
    // });
  }

  // Build the summary object
  const summary = {
    title: test.title || 'Untitled Test',
    description: test.description,
    type: test.type,
    access: test.access || 'public',
    totalSections: testSections.length,
    totalQuestions: totalQuestions,
    totalDuration: totalDuration,
    totalParticipants: invitations.length,
    scheduledDate: test.heldAt,
    sections: sectionDetails
  }

  return {
    isPublishable: !hasErrors,
    checklist,
    summary
  }
}
