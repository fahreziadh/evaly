import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import { nanoid } from 'nanoid'

import { type Id } from '../_generated/dataModel'
import { type QueryCtx, mutation, query } from '../_generated/server'

export const createInitialQuestions = mutation({
  args: {
    type: v.union(
      v.literal('multiple-choice'),
      v.literal('yes-or-no'),
      v.literal('text-field'),
      v.literal('file-upload'),
      v.literal('fill-the-blank'),
      v.literal('audio-response'),
      v.literal('video-response'),
      v.literal('dropdown'),
      v.literal('matching-pairs'),
      v.literal('slider-scale')
    ),
    order: v.number(),
    referenceId: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Unauthorized')
    }
    const user = await ctx.db.get(userId)
    if (!user) {
      throw new Error('User not found')
    }
    const organizationId = user.selectedOrganizationId
    if (!organizationId) {
      throw new Error('Organization not found')
    }
    let options
    if (args.type === 'yes-or-no') {
      options = [
        {
          id: nanoid(5),
          text: 'Yes',
          isCorrect: true
        },
        {
          id: nanoid(5),
          text: 'No',
          isCorrect: false
        }
      ]
    } else if (args.type === 'multiple-choice') {
      options = [
        {
          id: nanoid(5),
          text: '',
          isCorrect: true
        },
        {
          id: nanoid(5),
          text: '',
          isCorrect: false
        },
        {
          id: nanoid(5),
          text: '',
          isCorrect: false
        },
        {
          id: nanoid(5),
          text: '',
          isCorrect: false
        }
      ]
    }
    const questionId = await ctx.db.insert('question', {
      type: args.type,
      allowMultipleAnswers: false,
      organizationId,
      referenceId: args.referenceId,
      order: args.order,
      question: '<p></p>', // default question
      options
    })

    // sort other questions
    const questions = await ctx.db
      .query('question')
      .withIndex('by_reference_id', q => q.eq('referenceId', args.referenceId))
      .collect()
    const orderedQuestions = questions.sort((a, b) => a.order - b.order)

    for (const question of orderedQuestions) {
      if (question.order >= args.order && question._id !== questionId) {
        await ctx.db.patch(question._id, {
          order: question.order + 1
        })
      }
    }

    return questionId
  }
})

export const getAllByReferenceId = query({
  args: {
    referenceId: v.string() // couldbe sectionId or templateId
  },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query('question')
      .withIndex('by_reference_id', q => q.eq('referenceId', args.referenceId))
      .filter(q => q.lte(q.field('deletedAt'), 0))
      .collect()
    return questions.sort((a, b) => a.order - b.order)
  }
})

export const changeOrder = mutation({
  args: {
    questionIds: v.array(
      v.object({
        questionId: v.id('question'),
        order: v.number()
      })
    )
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkQuestionOwnership(
      ctx,
      args.questionIds[0].questionId
    )
    if (!isOwner) {
      throw new Error('Unauthorized')
    }

    for (const q of args.questionIds) {
      await ctx.db.patch(q.questionId, {
        order: q.order
      })
    }
  }
})

export const update = mutation({
  args: {
    id: v.id('question'),
    data: v.object({
      question: v.string(),
      options: v.optional(
        v.array(
          v.object({
            id: v.string(),
            text: v.string(),
            isCorrect: v.boolean()
          })
        )
      )
    })
  },
  handler: async (ctx, args) => {
    const isOwner = await checkQuestionOwnership(ctx, args.id)
    if (!isOwner) {
      throw new Error('Unauthorized')
    }
    await ctx.db.patch(args.id, args.data)
  }
})

export const getById = query({
  args: {
    id: v.id('question')
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkQuestionOwnership(ctx, args.id)
    if (!isOwner) {
      return undefined
    }
    const question = await ctx.db.get(args.id)
    if (!question || question.deletedAt) {
      return undefined
    }
    return question
  }
})

export const deleteById = mutation({
  args: {
    id: v.id('question')
  },
  handler: async (ctx, args) => {
    const { isOwner, question } = await checkQuestionOwnership(ctx, args.id)
    if (!isOwner) {
      throw new Error('Unauthorized')
    }

    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
      order: 0
    })

    const deletedQuestionOrder = question?.order
    const referenceId = question?.referenceId

    if (!deletedQuestionOrder || !referenceId) {
      return
    }

    // sort other questions
    const questions = await ctx.db
      .query('question')
      .withIndex('by_reference_id', q => q.eq('referenceId', question?.referenceId))
      .filter(q => q.lte(q.field('deletedAt'), 0))
      .collect()

    const orderedQuestions = questions.sort((a, b) => a.order - b.order)

    // update order of other questions
    for (const question of orderedQuestions) {
      if (question.order >= deletedQuestionOrder && question._id !== args.id) {
        await ctx.db.patch(question._id, {
          order: question.order - 1
        })
      }
    }
  }
})

async function checkQuestionOwnership(ctx: QueryCtx, questionId: Id<'question'>) {
  const userId = await getAuthUserId(ctx)
  if (!userId) {
    return { isOwner: false, question: undefined }
  }

  const user = await ctx.db.get(userId)
  if (!user) {
    return { isOwner: false, question: undefined }
  }

  const question = await ctx.db.get(questionId)
  const isOwner = question?.organizationId === user.selectedOrganizationId
  return { isOwner, question }
}
