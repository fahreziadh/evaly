import { z } from 'zod'

export const QuestionGenerated = z.object({
  questions: z
    .array(
      z.object({
        id: z
          .string()
          .describe(
            'Unique identifier for the question, if previously question has an ID use the previous ID, if not just use an empty string'
          ),
        order: z
          .number()
          .describe('The order/sequence number of this question in the list'),
        question: z
          .string()
          .describe(
            'The question text, can include markdown formatting for better readability'
          ),
        type: z
          .enum(['multiple-choice', 'yes-or-no', 'text-field'])
          .describe('The type of question - only these three types are supported'),
        options: z
          .array(
            z.object({
              id: z
                .string()
                .describe(
                  'Unique identifier for this option, if previously question has an ID use the previous ID, if not just use empty string'
                ),
              text: z.string().describe('The text of the option, can include markdown'),
              isCorrect: z
                .boolean()
                .describe(
                  'Whether this option is correct - exactly one option should be marked as correct'
                )
            })
          )
          .describe(
            'Array of options for this question - required for multiple-choice and yes-or-no types, should be empty for text-field'
          )
      })
    )
    .min(1)
    .describe('Array of generated questions')
})
