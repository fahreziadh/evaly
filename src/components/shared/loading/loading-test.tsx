import { cn } from '@/lib/utils'

import { Skeleton } from '@/components/ui/skeleton'

const LoadingTest = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex min-h-dvh flex-col gap-4', className)}>
      {Array.from({ length: 10 }).map((_, e) => (
        <Skeleton className="h-28 w-full" key={e} />
      ))}
    </div>
  )
}

export default LoadingTest
