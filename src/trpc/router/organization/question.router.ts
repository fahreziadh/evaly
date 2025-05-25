import { question } from '@/lib/db/schema'
import { organizerProcedure, router } from '@/trpc'
import { google } from '@ai-sdk/google'
import { generateObject, generateText } from 'ai'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'

import { checkQuestionOwner } from '@/services/organization/question/check-question-owner'
import { createQuestion } from '@/services/organization/question/create-question'
import { createQuestionTemplate } from '@/services/organization/question/create-question-template'
import { deleteQuestion } from '@/services/organization/question/delete-question'
import { getAllQuestionByReferenceId } from '@/services/organization/question/get-all-question-by-reference-id'
import { transferBetweenReference } from '@/services/organization/question/transfer-question-between-reference'
import { updateOrderBetweenQuestions } from '@/services/organization/question/update-order-between-questions'
import { updateQuestion } from '@/services/organization/question/update-question'

export const questionRouter = router({
  getAll: organizerProcedure
    .input(
      z.object({
        referenceId: z.string()
      })
    )
    .query(async ({ input }) => {
      return await getAllQuestionByReferenceId(input.referenceId)
    }),

  create: organizerProcedure
    .input(
      z.object({
        referenceId: z.string(),
        questions: z.array(createInsertSchema(question))
      })
    )
    .mutation(async ({ input }) => {
      return await createQuestion(input.referenceId, input.questions)
    }),

  update: organizerProcedure
    .input(
      z.object({
        id: z.string(),
        data: createUpdateSchema(question)
      })
    )
    .mutation(async ({ input }) => {
      return await updateQuestion(input.id, input.data)
    }),

  delete: organizerProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input }) => {
      return await deleteQuestion(input.id)
    }),

  updateOrder: organizerProcedure
    .input(
      z.array(
        z.object({
          questionId: z.string(),
          order: z.number()
        })
      )
    )
    .mutation(
      async ({
        input,
        ctx: {
          organizer: { organizationId }
        }
      }) => {
        await checkQuestionOwner(
          input.map(item => item.questionId),
          organizationId
        )

        const isUpdated = await updateOrderBetweenQuestions(input)

        if (!isUpdated) {
          throw new Error('Failed to update order')
        }

        return { message: 'Order updated successfully' }
      }
    ),

  transferBetweenReference: organizerProcedure
    .input(
      z.object({
        fromReferenceId: z.string(),
        toReferenceId: z.string(),
        order: z.number()
      })
    )
    .mutation(
      async ({
        input,
        ctx: {
          organizer: { organizationId }
        }
      }) => {
        return await transferBetweenReference({ ...input, organizationId })
      }
    ),

  llmValidate: organizerProcedure
    .input(
      z.object({
        prompt: z.string().min(1, { message: 'Prompt is required' }),
        context: z.enum(['educational', 'hr', 'quiz']).optional()
      })
    )
    .mutation(
      async ({
        input,
        ctx: {
          organizer: { organizationId, id: organizerId }
        }
      }) => {
        const { prompt, context } = input
        const response = await generateObject({
          model: google('gemini-2.0-flash-001'),
          prompt: `You are an assistant designed to extract structured information from user prompts.
        
        Analyze the user's input carefully and extract the following key information:
        1. The educational topic they want to create questions about
        2. The appropriate education level for the material
        3. The number of questions they want to generate
        4. The question type they want to use (if specified)
        
        Be precise and consistent in your extraction. The topic you identify will be used directly in subsequent prompts to generate educational content, so ensure it accurately represents the user's intent.
        
        CRITICAL REQUIREMENTS:
        - For the topic field: If the user does not explicitly mention an educational topic, you MUST return "undefined" for the topic value. Do not make assumptions or infer a topic if it's not clearly stated.
        - For the grade/education level: If the user does not explicitly mention a grade level, you MUST return "undefined". Do not guess or infer a grade level if it's not clearly stated.
        - For the suggestion: If the user's input is missing information or could be improved, provide a helpful suggestion. This could be asking them to specify a topic, grade level, or to make their topic more specific. If the input is valid and complete, leave this field empty.
        - For the questionType: Detect if the user mentions a specific question type. Map their description to one of our supported types: "multiple-choice", "text-field", or "yes-or-no". Look for phrases like "multiple choice", "MCQ", "text answer", "short answer", "essay", "open-ended", "yes/no", "true/false", etc. If no type is mentioned, default to "multiple-choice".
        - For the generationPrompt: Create a comprehensive, detailed prompt that can be used for question generation if the topic and grade are valid. This prompt should include specific instructions about the topic, difficulty level, question format (using the detected question type), and educational objectives. If either topic is "undefined" or grade is "undefined", leave this field empty.
        
        Do not try to be helpful by guessing these values - accuracy is more important than completeness. If information is missing, use "undefined" for those fields.
        
        IMPORTANT: You MUST respond in the EXACT SAME LANGUAGE that the user used in their prompt. If they write in Indonesian, Japanese, German, or any other language, analyze their request and respond in that same language. This includes all fields in your response - topic, suggestion, title, tags, and generationPrompt must all be in the user's language.
        
        User prompt: ${prompt}`,
          schema: z.object({
            topic: z
              .string()
              .describe(
                "The specific educational topic to create questions about. MUST be 'undefined' if no topic is clearly specified"
              ),
            grade: z
              .enum([
                'Kindergarten',
                '1st Grade',
                '2nd Grade',
                '3rd Grade',
                '4th Grade',
                '5th Grade',
                '6th Grade',
                '7th Grade',
                '8th Grade',
                '9th Grade',
                '10th Grade',
                '11th Grade',
                '12th Grade',
                'College',
                'undefined'
              ])
              .describe(
                "The appropriate education level for the material. MUST be 'undefined' if no grade level is clearly specified"
              ),
            questionCount: z
              .number()
              .int()
              .min(1)
              .max(50)
              .default(5)
              .describe('Number of questions to generate, default is 5.'),
            questionType: z
              .enum(['multiple-choice', 'text-field', 'yes-or-no'])
              .describe(
                "The type of questions to generate, based on user's description. Default to multiple-choice if not specified."
              ),
            isValid: z
              .boolean()
              .describe(
                'Whether the input contains all required information (topic and grade) to generate questions'
              ),
            suggestion: z
              .string()
              .describe(
                'A helpful message to show to the user about what information they should provide or how they could improve their prompt. Empty if the input is valid.'
              ),
            title: z
              .string()
              .describe(
                'A concise, descriptive title for the question set based on the topic and grade level'
              ),
            tags: z
              .array(z.string())
              .describe(
                '1-3 relevant tags that categorize this question set (only if necessary)'
              ),
            generationPrompt: z
              .string()
              .describe(
                'A comprehensive, detailed prompt that can be used for question generation. This should include specific instructions about the topic, difficulty level appropriate for the grade, question format (using the detected question type), and educational objectives. Empty if either topic or grade is undefined.'
              )
          })
        })

        if (!response.object.isValid) {
          return { ...response.object, templateCreated: null }
        }

        const templateCreated = await createQuestionTemplate({
          organizationId,
          organizerId,
          isAiGenerated: true,
          title: response.object.title,
          tags: response.object.tags,
          aiContents: [
            {
              prompt: response.object.generationPrompt,
              context: context || 'educational'
            }
          ]
        })

        return { ...response.object, templateCreated }
      }
    ),

  improvePrompt: organizerProcedure
    .input(z.string())
    .mutation(async ({ input: prompt }) => {
      const response = await generateText({
        model: google('gemini-2.0-flash-001'),
        prompt: `
          You are an expert at writing clear, effective prompts for question generation.
          
          I'll provide you with a user's prompt that they want to use to generate questions.
          Your task is to improve this prompt to make it clearer, more specific, and more likely to generate high-quality questions.
          
          Focus on:
          - Clarifying ambiguous language
          - Adding structure if needed
          - Ensuring the prompt specifies the desired question types, difficulty levels, and topics clearly
          - Maintaining the original intent of the prompt
          
          Original prompt: "${prompt}"
          
          Respond with ONLY the improved prompt text, with no explanations, examples, or additional commentary.
          If the prompt is already clear and effective, or you cannot meaningfully improve it, respond with an empty string.
          Do NOT include placeholder text like "[insert specific topic here]" or "[insert number]" in your response.
          
          IMPORTANT: Respond in the same language as the original prompt. If the original prompt is in English, respond in English. If it's in Spanish, respond in Spanish, etc.
        `
      })

      return response.text
    })
})
