import { v } from 'convex/values'

import type { Id } from '../_generated/dataModel'
import { query } from '../_generated/server'

export const getById = query({
  args: {
    id: v.string()
  },
  handler: async (ctx, args) => {
    const test = await ctx.db
      .query('test')
      .withIndex('by_id', q => q.eq('_id', args.id as Id<'test'>))
      .first()
    return test
  }
})
