// Replace path alias imports with relative paths
import db from '@/lib/db'
import {
  question,
  testAttempt,
  testAttemptAnswer,
  testSection,
  user
} from '@/lib/db/schema'
import { and, eq, isNull, or, sql } from 'drizzle-orm'

import { Section, Submission } from './get-test-submissions'

// Define types for detailed question and answer
type DetailedQuestion = {
  id: string
  text: string | null
  type: string | null
  correctAnswer: string | null // Simplified for now
  participantAnswer: string | null
  isCorrect: boolean | null
  sectionId: string
}

type SubmissionDetail = {
  submission: Submission
  sections: Section[]
  questions: DetailedQuestion[]
}

export const getSubmissionDetailsByEmail = async (
  testId: string,
  email: string
): Promise<SubmissionDetail | null> => {
  // 1. Fetch all active sections for this test
  const sectionsRaw = await db
    .select({
      id: testSection.id,
      title: sql<string>`${testSection}.title`
    })
    .from(testSection)
    .where(and(eq(testSection.testId, testId), isNull(testSection.deletedAt)))
    .orderBy(testSection.order)

  if (sectionsRaw.length === 0) {
    return null // Test not found or has no sections
  }

  // 2. Fetch all active questions for these sections
  const sectionIds = sectionsRaw.map(section => section.id)
  const questionsRaw = await db
    .select({
      id: question.id,
      sectionId: question.referenceId,
      question: question.question,
      type: question.type,
      options: question.options
    })
    .from(question)
    .where(
      and(
        or(...sectionIds.map(id => eq(question.referenceId, id))),
        isNull(question.deletedAt)
      )
    )

  // Group questions by section and count
  const questionsBySectionId: Record<string, typeof questionsRaw> = {}
  for (const q of questionsRaw) {
    if (!questionsBySectionId[q.sectionId]) {
      questionsBySectionId[q.sectionId] = []
    }
    questionsBySectionId[q.sectionId].push(q)
  }

  // Create sections with question counts
  const sections: Section[] = sectionsRaw.map(section => ({
    id: section.id,
    name: section.title,
    questionsCount: questionsBySectionId[section.id]?.length || 0
  }))

  // 3. Get all completed attempts for this participant
  const attemptsRaw = await db
    .select({
      id: testAttempt.id,
      participantEmail: testAttempt.participantEmail,
      testSectionId: testAttempt.testSectionId,
      startedAt: testAttempt.startedAt,
      completedAt: sql<string | null>`${testAttempt}.completed_at`
    })
    .from(testAttempt)
    .where(
      and(
        eq(testAttempt.testId, testId),
        eq(testAttempt.participantEmail, email),
        sql`${testAttempt}.completed_at IS NOT NULL`,
        isNull(testAttempt.deletedAt)
      )
    )

  if (attemptsRaw.length === 0) {
    return null // No completed attempts for this participant
  }

  // 4. Get user information
  const userInfoRaw = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image
    })
    .from(user)
    .where(eq(user.email, email))

  const userRecord = userInfoRaw[0]
  const name = userRecord?.name || email

  // 5. Get all answers for these attempts
  const attemptIds = attemptsRaw.map(attempt => attempt.id)

  const answersRaw = await db
    .select({
      id: testAttemptAnswer.id,
      attemptId: testAttemptAnswer.attemptId,
      questionId: testAttemptAnswer.questionId,
      answerText: sql<string | null>`${testAttemptAnswer}.answer_text`,
      answerOptions: sql<string[] | null>`${testAttemptAnswer}.answer_options`,
      isCorrect: testAttemptAnswer.isCorrect
    })
    .from(testAttemptAnswer)
    .where(
      and(
        or(...attemptIds.map(id => eq(testAttemptAnswer.attemptId, id))),
        isNull(testAttemptAnswer.deletedAt)
      )
    )

  // Create a map of questionId to question for quick lookup
  const questionMap = new Map(questionsRaw.map(q => [q.id, q]))

  // Create a map of questionId to sectionId for quick lookup
  const questionSectionMap = new Map(questionsRaw.map(q => [q.id, q.sectionId]))

  // Process answers to create detailed questions
  const detailedQuestions: DetailedQuestion[] = []
  const answeredQuestionIds = new Set<string>()

  // Initialize section data
  const sectionAnswers: Record<string, number> = {}
  const sectionCorrect: Record<string, number> = {}
  const sectionWrong: Record<string, number> = {}
  const sectionSubmitted: Record<string, string | null> = {}

  sections.forEach(section => {
    sectionAnswers[section.id] = 0
    sectionCorrect[section.id] = 0
    sectionWrong[section.id] = 0
    sectionSubmitted[section.id] = null
  })

  // Track section completion status
  const sectionCompletionStatus: Record<string, string | null> = {}
  sections.forEach(section => {
    sectionCompletionStatus[section.id] = null
  })

  // Count answers, correct, and wrong by section across all attempts
  let totalAnswered = 0
  let totalCorrect = 0
  let totalWrong = 0
  let latestCompletedAt = ''

  // Process each attempt
  for (const attempt of attemptsRaw) {
    // Track the latest completion time
    if (
      attempt.completedAt &&
      (!latestCompletedAt || attempt.completedAt > latestCompletedAt)
    ) {
      latestCompletedAt = attempt.completedAt
    }

    // Track section completion if this attempt belongs to a specific section
    if (attempt.testSectionId && attempt.completedAt) {
      if (
        !sectionCompletionStatus[attempt.testSectionId] ||
        attempt.completedAt > sectionCompletionStatus[attempt.testSectionId]!
      ) {
        sectionCompletionStatus[attempt.testSectionId] = attempt.completedAt
        sectionSubmitted[attempt.testSectionId] = attempt.completedAt
      }
    }

    // Get answers for this attempt
    const attemptAnswers = answersRaw.filter(a => a.attemptId === attempt.id)

    for (const answer of attemptAnswers) {
      // Skip if we've already processed this question or if questionId is null
      if (!answer.questionId || answeredQuestionIds.has(answer.questionId)) {
        continue
      }

      // Get the question and section
      const questionData = questionMap.get(answer.questionId)
      const sectionId = questionSectionMap.get(answer.questionId)

      if (!questionData || !sectionId) {
        continue
      }

      // Consider an answer provided if there's text or options selected
      const hasAnswer =
        answer.answerText || (answer.answerOptions && answer.answerOptions.length > 0)

      if (hasAnswer) {
        // Mark this question as answered
        answeredQuestionIds.add(answer.questionId)

        // Increment section and total counts
        sectionAnswers[sectionId]++
        totalAnswered++

        if (answer.isCorrect === true) {
          sectionCorrect[sectionId]++
          totalCorrect++
        } else if (answer.isCorrect === false) {
          sectionWrong[sectionId]++
          totalWrong++
        }

        // Extract correct answer from question options
        let correctAnswer: string | null = null
        if (questionData.options && Array.isArray(questionData.options)) {
          const correctOptions = questionData.options
            .filter((opt: { isCorrect: boolean; text: string }) => opt.isCorrect)
            .map((opt: { text: string }) => opt.text)

          if (correctOptions.length > 0) {
            correctAnswer = correctOptions.join(', ')
          }
        }

        // Format participant's answer
        let participantAnswer: string | null = null
        if (answer.answerText) {
          participantAnswer = answer.answerText
        } else if (answer.answerOptions && answer.answerOptions.length > 0) {
          // For multiple choice, find the text of the selected options
          if (questionData.options && Array.isArray(questionData.options)) {
            const selectedOptions = questionData.options
              .filter((opt: { id: string; text: string }) =>
                answer.answerOptions?.includes(opt.id)
              )
              .map((opt: { text: string }) => opt.text)

            if (selectedOptions.length > 0) {
              participantAnswer = selectedOptions.join(', ')
            }
          } else {
            participantAnswer = answer.answerOptions.join(', ')
          }
        }

        // Add to detailed questions
        detailedQuestions.push({
          id: answer.questionId,
          text: questionData.question,
          type: questionData.type,
          correctAnswer,
          participantAnswer,
          isCorrect: answer.isCorrect,
          sectionId
        })
      }
    }
  }

  // Calculate total questions count
  const totalQuestions = questionsRaw.length

  // Calculate score
  const score =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  // Create the submission
  const submission: Submission = {
    id: attemptsRaw[0].id, // Use the first attempt ID as the submission ID
    name,
    email,
    totalQuestions,
    answered: totalAnswered,
    image: userRecord?.image || null,
    correct: totalCorrect,
    wrong: totalWrong,
    unanswered: totalQuestions - totalAnswered,
    submittedAt: latestCompletedAt,
    score,
    rank: 0, // Rank is not relevant for a single submission
    sectionAnswers,
    sectionCorrect,
    sectionWrong,
    sectionSubmitted,
    status: 'completed' // Since we're only fetching completed attempts
  }

  // Add unanswered questions to the detailed questions list
  for (const q of questionsRaw) {
    if (!answeredQuestionIds.has(q.id)) {
      detailedQuestions.push({
        id: q.id,
        text: q.question,
        type: q.type,
        correctAnswer: null, // Don't show correct answer for unanswered questions
        participantAnswer: null,
        isCorrect: null,
        sectionId: q.sectionId
      })
    }
  }

  // Sort questions by section
  detailedQuestions.sort((a, b) => {
    // First sort by section ID
    const sectionComparison = a.sectionId.localeCompare(b.sectionId)
    if (sectionComparison !== 0) {
      return sectionComparison
    }

    // Then by question ID (as a proxy for question order)
    return a.id.localeCompare(b.id)
  })

  return {
    submission,
    sections: sections.map(s => ({
      id: s.id,
      name: s.name,
      questionsCount: s.questionsCount
    })),
    questions: detailedQuestions
  }
}
