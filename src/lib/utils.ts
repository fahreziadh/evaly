import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { Question } from '@/types/question'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Update a question in the questions array
 * @param prevQuestions - The existing questions array
 * @param updatedQuestion - The updated question
 * @returns The updated questions array with the question updated, or the original array if the question is not found
 */
export const updateQuestionInArray = (
  prevQuestions: Question[],
  updatedQuestion: Question
): Question[] => {
  const findIndex = prevQuestions.findIndex(q => q.id === updatedQuestion.id)

  // If the question is found, update it
  if (findIndex >= 0) {
    return [
      ...prevQuestions.slice(0, findIndex),
      updatedQuestion,
      ...prevQuestions.slice(findIndex + 1)
    ]
  }

  // If the question is not found, return the original array
  return prevQuestions
}

/**
 * Insert questions at the correct position based on their order
 * @param prevQuestions - The existing questions array
 * @param newQuestions - The new questions to insert
 * @returns The updated questions array with new questions inserted at the correct position
 */
export const insertQuestionsAtCorrectPosition = (
  prevQuestions: Question[],
  newQuestions: Question[]
): Question[] => {
  if (newQuestions.length === 0) return prevQuestions

  // Find the first question's order (which is the insertion point)
  const firstNewQuestionOrder = newQuestions[0].order

  if (!firstNewQuestionOrder) {
    // If no order is defined, just append to the end (fallback)
    return [...prevQuestions, ...newQuestions]
  }

  // Find the index where we should insert the new questions
  // Order starts from 1, but array index starts from 0
  const insertIndex = prevQuestions.findIndex(
    q => q.order && q.order >= firstNewQuestionOrder
  )

  // Create a new array with updated questions
  let result
  if (insertIndex === -1) {
    // If no matching order found, append to the end
    result = [...prevQuestions, ...newQuestions]
  } else {
    // Insert the new questions at the correct position
    result = [
      ...prevQuestions.slice(0, insertIndex),
      ...newQuestions,
      ...prevQuestions.slice(insertIndex)
    ]
  }

  // Update the order field to ensure it starts from 1 and is sequential
  return result.map((question, index) => ({
    ...question,
    order: index + 1
  }))
}
