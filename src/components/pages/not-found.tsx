import { Link } from '@tanstack/react-router'

import { Button } from '../ui/button'

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-lg">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant={'outline-solid'} onClick={() => window.history.back()}>
          Go back
        </Button>
        <Link to="/">
          <Button>Start Over</Button>
        </Link>
      </div>
    </div>
  )
}
