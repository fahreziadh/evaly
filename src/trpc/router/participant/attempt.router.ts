import { testAttemptAnswer } from '@/lib/db/schema/test.attempt.answer'
import { participantProcedure, router } from '@/trpc'
import { TRPCError } from '@trpc/server'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { checkAttemptAccess } from '@/services/participants/attempt/check-attempt-acces'
import { getAttemptAnswers } from '@/services/participants/attempt/get-attempt-answers'
import { getAttemptById } from '@/services/participants/attempt/get-attempt-by-id'
import { postAttemptAnswer } from '@/services/participants/attempt/post-attempt-answer'
import { startAttempt } from '@/services/participants/attempt/start-attempt'
import { submitAttempt } from '@/services/participants/attempt/submit-attempt'
import { getTestById } from '@/services/participants/test/get-test-by-id'

export const attemptRouter = router({
  getAttemptById: participantProcedure
    .input(z.string())
    .query(async ({ input, ctx: { user } }) => {
      const check = await checkAttemptAccess(input, user.email)

      if (!check || !check.testId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Attempt not found'
        })
      }

      if (!check.test.isPublished) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Test is not published'
        })
      }

      if (check.test.finishedAt) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Test is finished' })
      }

      if (check.completedAt) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You have already completed this test'
        })
      }

      return await getAttemptById(input)
    }),

  submitAnswer: participantProcedure
    .input(
      z.object({
        attemptId: z.string(),
        data: createInsertSchema(testAttemptAnswer)
      })
    )
    .mutation(async ({ input, ctx: { user } }) => {
      const check = await checkAttemptAccess(input.attemptId, user.email)

      if (!check || !check.testId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Attempt not found'
        })
      }

      if (!check.test.isPublished) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Test is not published'
        })
      }

      if (check.test.finishedAt) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Test is finished' })
      }

      if (check.completedAt) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You have already completed this test'
        })
      }

      const answer = await postAttemptAnswer({
        ...input.data,
        attemptId: input.attemptId
      })

      return answer
    }),

  startAttempt: participantProcedure
    .input(
      z.object({
        testSectionId: z.string(),
        testId: z.string()
      })
    )
    .mutation(async ({ input, ctx: { user } }) => {
      const attempt = await startAttempt({
        testId: input.testId,
        testSectionId: input.testSectionId,
        email: user?.email
      })

      if (attempt.error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: attempt.error.message
        })
      }
      // Return the attempt
      return attempt.data
    }),

  submitAttempt: participantProcedure
    .input(
      z.object({
        attemptId: z.string()
      })
    )
    .mutation(async ({ input, ctx: { user } }) => {
      const check = await checkAttemptAccess(input.attemptId, user.email)

      if (!check || !check.testId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Attempt not found'
        })
      }

      if (check.completedAt) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Test is finished' })
      }

      const test = await getTestById({ id: check.testId, email: user.email })

      const submittedAttempt = await submitAttempt(input.attemptId)

      const currentSectionOrder = test.testSections?.find(
        section => section.id === submittedAttempt.testSectionId
      )?.order

      if (!currentSectionOrder) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Current section not found' })
      }

      const nextSection = test.testSections?.find(
        section => section.order === currentSectionOrder + 1
      )

      return {
        ...submittedAttempt,
        nextSection
      }
    }),

  getAttemptAnswers: participantProcedure
    .input(
      z.object({
        attemptId: z.string()
      })
    )
    .query(async ({ input, ctx: { user } }) => {
      const check = await checkAttemptAccess(input.attemptId, user.email)
      if (!check || !check.testId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Attempt not found'
        })
      }

      if (!check.test.isPublished) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Test is not published'
        })
      }

      if (check.test.finishedAt) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Test is finished'
        })
      }

      const answers = await getAttemptAnswers(input.attemptId)

      return answers
    })
})
