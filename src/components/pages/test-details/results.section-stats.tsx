import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
import { useSearch } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { useMemo } from 'react'

import { Card } from '@/components/ui/card'

import { cn } from '@/lib/utils'

const SectionStats = ({ className }: { className?: string }) => {
  const { testId } = useSearch({
    from: '/(organizer)/app/tests/details'
  })

  const presence = useQuery(api.participant.testPresence.list, {
    testId: testId as Id<'test'>
  })

  const progress = useQuery(api.organizer.testResult.getProgress, {
    testId: testId as Id<'test'>
  })

  const averageFinished = useMemo(() => {
    const totalSeconds = progress?.averageTime || 0
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = Math.floor(totalSeconds % 60)

    return {
      h,
      m,
      s
    }
  }, [progress?.averageTime])

  return (
    <Card className={cn('grid grid-cols-4 gap-3 divide-x', className)}>
      <div className="flex flex-row justify-between p-4">
        <div>
          <h1 className="text-sm font-medium">Working in progress</h1>
          <div className="flex flex-row items-center gap-4">
            <NumberFlow
              value={progress?.workingInProgress || 0}
              className="text-3xl font-bold"
            />

            <NumberFlow
              value={presence?.length || 0}
              suffix=" Online"
              className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 text-sm text-emerald-600"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between p-4">
        <div>
          <h1 className="text-sm font-medium">Submission</h1>
          <NumberFlow
            value={progress?.submissions || 0}
            className="text-3xl font-bold"
          />
        </div>
      </div>
      <div className="flex flex-row justify-between p-4">
        <div>
          <h1 className="text-sm font-medium">Average Time</h1>
          <NumberFlowGroup>
            <div
              style={{
                fontVariantNumeric: 'tabular-nums'
              }}
              className="item-baseline flex gap-2 text-3xl font-bold"
            >
              {averageFinished.h > 0 ? (
                <NumberFlow
                  trend={-1}
                  value={averageFinished.h}
                  format={{ minimumIntegerDigits: 2 }}
                  suffix="h"
                />
              ) : null}

              <NumberFlow
                trend={-1}
                value={averageFinished.m}
                digits={{ 1: { max: 5 } }}
                suffix="m"
                format={{ minimumIntegerDigits: 2 }}
              />
              {averageFinished.m === 0 ? (
                <NumberFlow
                  trend={-1}
                  value={averageFinished.s}
                  digits={{ 1: { max: 5 } }}
                  suffix="s"
                  format={{ minimumIntegerDigits: 2 }}
                />
              ) : null}
            </div>
          </NumberFlowGroup>
        </div>
      </div>
      <div className="flex flex-row justify-between p-4">
        <div className="flex-1">
          <h1 className="text-sm font-medium">Completetion Rate</h1>
          <NumberFlow
            value={progress?.completitionRate || 0}
            className="text-3xl font-bold"
            suffix="%"
          />
        </div>
      </div>
    </Card>
  )
}

export default SectionStats
