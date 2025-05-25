import { router } from '@/trpc'
import { participantProcedure } from '@/trpc'
import { z } from 'zod'

import { getAllAttemptByTestId } from '@/services/participants/attempt/get-all-attempt-by-test-id'
import { getTestById } from '@/services/participants/test/get-test-by-id'

export const testRouter = router({
  getTestById: participantProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const test = await getTestById({ id: input, email: ctx.user?.email })
    const attempt = await getAllAttemptByTestId(input, ctx.user?.email)

    return {
      ...test,
      attempt
    }
  })
})
