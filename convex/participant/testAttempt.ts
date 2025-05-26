import { getAuthUserId } from '@convex-dev/auth/server'
import { ConvexError, v } from 'convex/values'

import { mutation, query } from '../_generated/server'

export const start = mutation({
  args: {
    testSectionId: v.id('testSection')
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError('Unauthorized')
    }

    // Check Test Section
    const testSection = await ctx.db.get(args.testSectionId)
    if (!testSection) {
      throw new ConvexError('Test section not found')
    }

    const test = await ctx.db.get(testSection.testId)
    if (!test) {
      throw new ConvexError('Test not found')
    }

    // If the user has already started the test, return the current test attempt
    const currentTestAttempt = await ctx.db
      .query('testAttempt')
      .withIndex('by_participant_test_section', q =>
        q.eq('participantId', userId).eq('testSectionId', args.testSectionId)
      )
      .first()

    if (currentTestAttempt) {
      return currentTestAttempt
    }

    // If not, create a new test attempt
    const newTestAttemptId = await ctx.db.insert('testAttempt', {
      participantId: userId,
      startedAt: Date.now(),
      testId: test._id,
      testSectionId: testSection._id
    })

    const newTestAttempt = await ctx.db.get(newTestAttemptId)

    if (!newTestAttempt) {
      throw new ConvexError('Failed to create test attempt')
    }

    return newTestAttempt
  }
})

export const getByTestIdAndParticipantId = query({
  args: {
    testId: v.id('test')
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    const testAttempt = await ctx.db
      .query('testAttempt')
      .withIndex('by_participant_test', q =>
        q.eq('participantId', userId).eq('testId', args.testId)
      )
      .collect()

    return testAttempt
  }
})

export const getById = query({
  args: {
    id: v.id('testAttempt')
  },
  handler: async (ctx, args) => {
    const testAttempt = await ctx.db.get(args.id)
    if (!testAttempt) {
      return null
    }

    const questions = await ctx.db
      .query('question')
      .withIndex('by_reference_id', q => q.eq('referenceId', testAttempt.testSectionId))
      .filter(q => q.lte(q.field('deletedAt'), 0))
      .collect()

    // Order questions by order and remove the answer from the question options
    const orderedQuestions = questions
      .sort((a, b) => a.order - b.order)
      .map(question => {
        const options = question.options?.map(option => {
          return {
            ...option,
            isCorrect: false
          }
        })
        return {
          ...question,
          options
        }
      })

    return {
      ...testAttempt,
      questions: orderedQuestions
    }
  }
})

export const finish = mutation({
  args: {
    id: v.id('testAttempt')
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError('Unauthorized')
    }

    const testAttempt = await ctx.db.get(args.id)
    if (!testAttempt) {
      throw new ConvexError('Test attempt not found')
    }

    if (testAttempt.participantId !== userId) {
      throw new ConvexError('Unauthorized')
    }

    return await ctx.db.patch(args.id, {
      finishedAt: Date.now()
    })
  }
})
