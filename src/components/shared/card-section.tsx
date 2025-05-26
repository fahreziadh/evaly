import type { DataModel } from '@convex/_generated/dataModel'
import { CheckIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'

import { cn } from '@/lib/utils'

const CardSection = ({
  data,
  isSelected,
  onClick
}: {
  data?: DataModel['testSection']['document'] & { numOfQuestions: number }
  onClick?: () => void
  isSelected?: boolean
}) => {
  if (!data) return null
  return (
    <Card
      key={data._id}
      onClick={onClick}
      className={cn(
        'group/section bg-card relative flex flex-col justify-start p-3 select-none',
        isSelected ? 'border-primary border' : 'hover:bg-secondary'
      )}
    >
      {isSelected ? (
        <div className="absolute top-2 right-2">
          <CheckIcon size={16} />
        </div>
      ) : null}
      <span className="text-sm font-medium">
        {data.order}. {data.title || `Section ${data.order}`}
      </span>
      <div className="mt-1 flex flex-row flex-wrap gap-3 text-xs">
        {/* {data.duration ? (
          <span className="flex flex-row gap-1 items-center">
            <ClockIcon size={14} />{" "}
            {Math.floor(data.duration / 60) > 0
              ? `${Math.floor(data.duration / 60)}h `
              : ""}
            {data.duration % 60}m
          </span>
        ) : (
          <span className="flex flex-row gap-1 items-center">
            <ClockIcon size={14} />
            0m
          </span>
        )} */}
        <span className="rounded-full border px-2 py-0.5">
          {JSON.stringify(data.numOfQuestions)} Questions
        </span>
      </div>
    </Card>
  )
}

export default CardSection
