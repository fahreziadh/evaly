import { testSection } from '@/lib/db/schema/test.section'
import { organizerProcedure, router } from '@/trpc'
import { createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

import { createSection } from '@/services/organization/test-section/create-section'
import { deleteSectionById } from '@/services/organization/test-section/delete-section-by-id'
import { getAllSectionByTestId } from '@/services/organization/test-section/get-all-section-by-test-id'
import { getSectionById } from '@/services/organization/test-section/get-section-by-id'
import { updateOrderSection } from '@/services/organization/test-section/update-order-section'
import { updateSection } from '@/services/organization/test-section/update-section'

export const testSectionRouter = router({
  getAll: organizerProcedure
    .input(
      z.object({
        testId: z.string()
      })
    )
    .query(async ({ input }) => {
      const testId = input.testId

      return await getAllSectionByTestId(testId)
    }),

  create: organizerProcedure
    .input(
      z.object({
        testId: z.string()
      })
    )
    .mutation(async ({ input }) => {
      return await createSection(input.testId)
    }),

  getById: organizerProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input }) => {
      return await getSectionById(input.id)
    }),

  delete: organizerProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input }) => {
      return await deleteSectionById(input.id)
    }),

  update: organizerProcedure
    .input(
      z.object({
        id: z.string(),
        data: createUpdateSchema(testSection, {})
      })
    )
    .mutation(async ({ input }) => {
      return await updateSection(input.id, input.data)
    }),

  updateOrder: organizerProcedure
    .input(
      z.object({
        testId: z.string(),
        order: z.array(
          z.string({
            description: 'Section ID is required'
          })
        )
      })
    )
    .mutation(async ({ input }) => {
      return await updateOrderSection(input.testId, input.order)
    })
})
