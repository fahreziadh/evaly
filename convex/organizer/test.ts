import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { type Id } from '../_generated/dataModel'
import { type QueryCtx, mutation, query } from '../_generated/server'

export const createTest = mutation({
  args: {
    type: v.union(v.literal('live'), v.literal('self-paced'))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('User not found')
    }

    const user = await ctx.db.get(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const organizationId = user.selectedOrganizationId
    const organizerId = user.selectedOrganizerId
    if (!organizationId || !organizerId) {
      throw new Error('Organization or organizer not found')
    }

    const test = await ctx.db.insert('test', {
      title: '',
      access: 'public',
      createdByOrganizerId: organizerId,
      organizationId,
      isPublished: false,
      showResultImmediately: false,
      type: args.type
    })

    await ctx.db.insert('testSection', {
      order: 1,
      testId: test,
      title: ''
    })

    return test
  }
})

export const getTests = query({
  args: {},
  handler: async ctx => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return []
    }

    const user = await ctx.db.get(userId)
    if (!user) {
      return []
    }

    const organizationId = user.selectedOrganizationId
    if (!organizationId) {
      return []
    }

    const tests = await ctx.db
      .query('test')
      .withIndex('by_organization_id', q => q.eq('organizationId', organizationId))
      .filter(q => q.lte(q.field('deletedAt'), 0))
      .order('desc')
      .collect()

    return tests
  }
})

export const deleteTest = mutation({
  args: {
    testId: v.id('test')
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkTestOwnership(ctx, args.testId)
    if (!isOwner) {
      throw new Error('You are not allowed to delete this test')
    }

    await ctx.db.patch(args.testId, {
      deletedAt: Date.now()
    })
  }
})

export const getTestById = query({
  args: {
    testId: v.id('test')
  },
  handler: async (ctx, args) => {
    const { isOwner, test } = await checkTestOwnership(ctx, args.testId)
    if (!isOwner) {
      return null
    }

    if (!test) {
      return null
    }

    return test
  }
})

export const updateTest = mutation({
  args: {
    testId: v.id('test'),
    data: v.object({
      title: v.string(),
      access: v.union(v.literal('public'), v.literal('private')),
      showResultImmediately: v.boolean(),
      isPublished: v.boolean(),
      type: v.union(v.literal('live'), v.literal('self-paced')),
      description: v.optional(v.string()),
      finishedAt: v.optional(v.number())
    })
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkTestOwnership(ctx, args.testId)
    if (!isOwner) {
      throw new Error('You are not allowed to update this test')
    }

    await ctx.db.patch(args.testId, {
      title: args.data.title,
      access: args.data.access,
      showResultImmediately: args.data.showResultImmediately,
      isPublished: args.data.isPublished,
      type: args.data.type,
      description: args.data.description,
      finishedAt: args.data.finishedAt
    })
  }
})

export const duplicateTest = mutation({
  args: {
    testId: v.id('test')
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkTestOwnership(ctx, args.testId)
    if (!isOwner) {
      throw new Error('You are not allowed to duplicate this test')
    }

    // Duplicate the test
    const test = await ctx.db.get(args.testId)
    if (!test) {
      throw new Error('Test not found')
    }

    const newTestId = await ctx.db.insert('test', {
      title: `${test.title} (Copy)`,
      access: test.access,
      createdByOrganizerId: test.createdByOrganizerId,
      organizationId: test.organizationId,
      isPublished: false,
      showResultImmediately: test.showResultImmediately,
      type: test.type,
      description: test.description
    })

    // Duplicate the all test sections
    const testSections = await ctx.db
      .query('testSection')
      .withIndex('by_test_id', q => q.eq('testId', args.testId))
      .filter(q => q.lte(q.field('deletedAt'), 0))
      .collect()

    for (const testSection of testSections) {
      const newTestSectionId = await ctx.db.insert('testSection', {
        testId: newTestId,
        order: testSection.order,
        title: testSection.title,
        description: testSection.description,
        duration: testSection.duration
      })

      // Duplicate the all test questions
      const testQuestions = await ctx.db
        .query('question')
        .withIndex('by_reference_id', q => q.eq('referenceId', testSection._id))
        .filter(q => q.lte(q.field('deletedAt'), 0))
        .collect()

      for (const question of testQuestions) {
        await ctx.db.insert('question', {
          referenceId: newTestSectionId,
          allowMultipleAnswers: question.allowMultipleAnswers,
          order: question.order,
          organizationId: question.organizationId,
          pointValue: question.pointValue,
          question: question.question,
          type: question.type,
          options: question.options
        })
      }
    }

    return newTestId
  }
})

export async function checkTestOwnership(ctx: QueryCtx, testId: Id<'test'>) {
  const userId = await getAuthUserId(ctx)
  if (!userId) {
    return {
      isOwner: false,
      test: null
    }
  }

  const user = await ctx.db.get(userId)
  if (!user) {
    return {
      isOwner: false,
      test: null
    }
  }

  // check if the test is available
  const test = await ctx.db.get(testId)
  if (!test) {
    return {
      isOwner: false,
      test: null
    }
  }

  const organizationId = user.selectedOrganizationId
  if (!organizationId) {
    return {
      isOwner: false,
      test: null
    }
  }

  // check if the user is the owner of the test
  if (test.organizationId !== organizationId) {
    return {
      isOwner: false,
      test: null
    }
  }

  return {
    isOwner: true,
    test
  }
}
