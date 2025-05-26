import { nanoid } from 'nanoid'

import type { QuestionType } from './question-type'

export const getDefaultOptions = (type: QuestionType) => {
  switch (type) {
    case 'multiple-choice':
      return Array.from({ length: 4 }, (_, index) => ({
        id: nanoid(5),
        text: ``,
        isCorrect: index === 0
      }))
    case 'yes-or-no':
      return [
        { id: nanoid(5), text: 'Yes', isCorrect: true },
        { id: nanoid(5), text: 'No', isCorrect: false }
      ]
    default:
      return []
  }
}
