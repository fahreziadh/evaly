import { publicProcedure, router } from '.'
import { organizationRouter } from './router/organization'
import { participantRouter } from './router/participant'

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return new Date().toISOString()
  }),
  organization: organizationRouter,
  participant: participantRouter
})

export type AppRouter = typeof appRouter
