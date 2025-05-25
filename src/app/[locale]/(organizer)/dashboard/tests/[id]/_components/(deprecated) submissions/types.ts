export interface Submission {
  id: number | string
  name: string
  image: string | null
  email: string
  totalQuestions: number
  answered: number
  correct: number
  wrong: number
  unanswered: number
  submittedAt: string | null
  startedAt: string | null
  score: number
  rank: number
  sectionId?: string
  sectionAnswers: Record<string, number>
  sectionCorrect: Record<string, number>
  sectionWrong: Record<string, number>
  sectionSubmitted: Record<string, string | null>
  status: 'completed' | 'in-progress' | 'not-started' | 'test-ended'
}

export interface Section {
  id: string
  name: string
  questionsCount: number
}

export type Question = {
  id: string
  text: string
  type: 'multiple_choice' | 'true_false' | 'short_answer'
  correctAnswer: string
  participantAnswer: string | null
  isCorrect: boolean | null
  sectionId: string // Changed to string to match section IDs
}

export type SortConfig = {
  key: keyof Submission | null
  direction: 'asc' | 'desc'
}

export type Column = {
  key: keyof Submission
  label: string
  align?: 'left' | 'center' | 'right'
  width?: string
  render?: (
    value: Submission[keyof Submission],
    submission: Submission
  ) => React.ReactNode
  searchable?: boolean
}
