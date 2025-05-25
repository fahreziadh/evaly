import { questionTemplate } from '@/lib/db/schema'
import { organizerProcedure, router } from '@/trpc'
import { createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

import { createQuestionTemplate } from '@/services/organization/question/create-question-template'
import { deleteQuestionTemplate } from '@/services/organization/question/delete-question-template'
import { getAllQuestionTemplate } from '@/services/organization/question/get-all-question-template'
import { getQuestionTemplateById } from '@/services/organization/question/get-question-template-by-id'
import { updateQuestionTemplate } from '@/services/organization/question/update-question-template'

export const questionTemplateRouter = router({
  create: organizerProcedure
    .input(
      z.object({
        title: z.string()
      })
    )
    .mutation(
      async ({
        input,
        ctx: {
          organizer: { organizationId, id }
        }
      }) => {
        return await createQuestionTemplate({
          organizationId,
          organizerId: id,
          title: input.title
        })
      }
    ),

  getAll: organizerProcedure.query(
    async ({
      ctx: {
        organizer: { organizationId }
      }
    }) => {
      return await getAllQuestionTemplate(organizationId)
    }
  ),

  getById: organizerProcedure.input(z.object({ id: z.string() })).query(
    async ({
      input,
      ctx: {
        organizer: { organizationId }
      }
    }) => {
      return await getQuestionTemplateById(input.id, organizationId)
    }
  ),

  delete: organizerProcedure.input(z.object({ id: z.string() })).mutation(
    async ({
      input,
      ctx: {
        organizer: { organizationId }
      }
    }) => {
      return await deleteQuestionTemplate(input.id, organizationId)
    }
  ),

  update: organizerProcedure
    .input(z.object({ id: z.string(), data: createUpdateSchema(questionTemplate) }))
    .mutation(
      async ({
        input,
        ctx: {
          organizer: { organizationId }
        }
      }) => {
        return await updateQuestionTemplate(input.id, organizationId, input.data)
      }
    )
})
