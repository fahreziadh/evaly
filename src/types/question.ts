import { question } from '@/lib/db/schema/question'
import { questionTemplate } from '@/lib/db/schema/question.template'

export type { QuestionType } from './question-types'

export type Question = typeof question.$inferSelect
export type InsertQuestion = typeof question.$inferInsert
export type UpdateQuestion = Partial<InsertQuestion>

export type QuestionTemplate = typeof questionTemplate.$inferSelect
export type QuestionTemplateWithQuestions = QuestionTemplate & {
  questions?: Question[]
}
