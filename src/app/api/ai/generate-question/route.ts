import { NextRequest, NextResponse } from 'next/server'

import db from '@/lib/db'
import { buildConflictUpdateColumns } from '@/lib/db/buildconflictupdatecolumns'
import { question } from '@/lib/db/schema'
import { google } from '@ai-sdk/google'
import { streamObject } from 'ai'
import { nanoid } from 'nanoid'
import { ulid } from 'ulidx'

import { updateQuestionTemplate } from '@/services/organization/question/update-question-template'

import { trpc } from '@/trpc/trpc.server'

import { InsertQuestion, UpdateQuestion } from '@/types/question'
import { QuestionGenerated } from '@/types/question.generated'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    prompt: string
    templateId: string
    context: 'educational' | 'hr' | 'quiz'
  }

  let prompt = body.prompt
  let context = body.context

  const userProfile = await trpc.organization.profile()
  const organizationId = userProfile?.organizer.organizationId

  // Get Existing Data
  const template = await updateQuestionTemplate(body.templateId, organizationId, {
    isGenerating: true,
    isGeneratingExpiredAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5min
  })

  if (!template) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  // Assign the last prompt and context if there is no input or if user didn't override it
  if (template.aiContents && template.aiContents[template.aiContents?.length - 1]) {
    const lastAiContents = template.aiContents[template.aiContents?.length - 1]

    if (!prompt) {
      prompt = lastAiContents.prompt
      context = lastAiContents.context
    }

    const message = await streamObject({
      model: google('gemini-2.0-flash-001'),
      prompt: `You are an expert question generator. Based on the following topic, context, and instructions, generate well-crafted questions.

Topic: ${prompt}
Template ID: ${body.templateId}
Context: ${context}

Instructions:
1. Create questions that are clear, well-formatted, and appropriate for the specified context and topic
2. For "educational" context: Focus on testing knowledge, understanding, and application of concepts in academic settings
3. For "hr" context: Focus on evaluating skills, experience, problem-solving abilities, and cultural fit for job candidates
4. For "quiz" context: Create engaging, fun questions suitable for trivia or general knowledge quizzes
5. Each question should be properly formatted with correct grammar and punctuation
6. For multiple-choice questions, ensure there is exactly one correct answer and provide plausible distractors
7. Questions can include Markdown formatting for better readability (bold, italics, lists, etc.)
8. For "multiple-choice" type questions, always provide exactly 4 options
9. For "yes-or-no" type questions, always provide exactly 2 options (Yes and No)
10. For "text-field" type questions, do not provide any options
11. Output language should match the language used in the input prompt
12. IMPORTANT: For multiple-choice questions, randomize the position of the correct answer. Do not always put the correct answer in the same position (e.g., not always as the first option or last option)

Please generate questions according to the specified schema structure.`,
      schema: QuestionGenerated,
      maxRetries: 3,
      onFinish: async ({ usage, object }) => {
        if (!object?.questions || !object?.questions.length || !prompt) {
          return
        }

        const currentAiContents = template.aiContents || []
        const aiContentVersions = [
          ...currentAiContents,
          { context, prompt, questions: object?.questions, usage }
        ]

        const insertedQuestions: InsertQuestion[] = object?.questions.map(e => ({
          id: 'qst-' + ulid(),
          referenceId: body.templateId,
          question: e.question,
          order: e.order,
          type: e.type as UpdateQuestion['type'],
          organizationId,
          options: e.options.map(e => ({
            id: e.id.length > 0 ? e.id : nanoid(5),
            text: e.text,
            isCorrect: e.isCorrect
          }))
        }))

        console.log(insertedQuestions)

        await db
          .insert(question)
          .values(insertedQuestions)
          .onConflictDoUpdate({
            target: [question.id],
            set: buildConflictUpdateColumns(question, ['question', 'type', 'options'])
          })

        await updateQuestionTemplate(body.templateId, organizationId, {
          aiContents: aiContentVersions,
          updatedAt: new Date().toISOString(),
          isAiGenerated: true,
          isGenerating: false,
          isGeneratingExpiredAt: null
        })
      },
      async onError() {
        await updateQuestionTemplate(body.templateId, organizationId, {
          isGenerating: false,
          isGeneratingExpiredAt: null
        })
      }
    })

    return message.toTextStreamResponse()
  }
}
