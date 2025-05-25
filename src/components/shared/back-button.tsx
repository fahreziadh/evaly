import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'

import { Button } from '../ui/button'
import { useProgressRouter } from './progress-bar'

const BackButton = ({
  className,
  fallbackUrl = '/dashboard',
  href
}: {
  className?: string
  fallbackUrl?: string
  href?: string
}) => {
  const router = useProgressRouter()

  const onBackClick = () => {
    if (href) {
      router.push(href)
      return
    }
    // Check if there's a previous page in the history
    if (window.history.length > 1) {
      router.back()
    } else {
      // If this is the first page, navigate to fallback URL
      router.push(fallbackUrl)
    }
  }

  return (
    <Button
      className={cn(className)}
      variant={'ghost'}
      size={'icon-sm'}
      type="button"
      onClick={onBackClick}
    >
      <ChevronLeft className="size-5" />
    </Button>
  )
}

export default BackButton
