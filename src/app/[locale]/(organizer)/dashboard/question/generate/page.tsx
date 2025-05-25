'use client'

import { cn } from '@/lib/utils'

import GenerateQuestionInputPrompt from '@/components/shared/generate-question-input-prompt'

const Page = () => {
  return (
    <div className={cn('container mt-[35vh] flex flex-1 flex-col')}>
      {/* Prompt Section */}
      <GenerateQuestionInputPrompt />

      {/* Recent Section */}
      {/* <SectionRecent /> */}
    </div>
  )
}

export default Page
