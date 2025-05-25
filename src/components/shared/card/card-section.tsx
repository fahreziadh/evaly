import { cn } from '@/lib/utils'
import { CheckIcon, CircleHelp, ClockIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'

import { TestSection } from '@/types/test'

const CardSection = ({
  data,
  isSelected,
  onClick
}: {
  data?: TestSection
  onClick?: () => void
  isSelected?: boolean
}) => {
  if (!data) return null
  return (
    <Card
      key={data.id}
      onClick={onClick}
      className={cn(
        'group/section relative flex cursor-pointer flex-col justify-start border-none p-3 select-none',
        isSelected ? 'bg-secondary' : 'hover:bg-secondary'
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
      <div className="text-muted-foreground mt-2 flex flex-row flex-wrap gap-3 text-xs">
        {data.duration ? (
          <span className="flex flex-row items-center gap-1">
            <ClockIcon size={14} />{' '}
            {Math.floor(data.duration / 60) > 0
              ? `${Math.floor(data.duration / 60)}h `
              : ''}
            {data.duration % 60}m
          </span>
        ) : (
          <span className="flex flex-row items-center gap-1">
            <ClockIcon size={14} />
            0m
          </span>
        )}
        <span className="flex flex-row items-center gap-1">
          <CircleHelp size={14} /> {JSON.stringify(data.numOfQuestions)} Questions
        </span>
      </div>
    </Card>
  )
}

export default CardSection
