'use client'

import { Link as NextLink, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'
import { useSpring } from 'motion/react'
import {
  ComponentProps,
  ReactNode,
  createContext,
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

const ProgressBarContext = createContext<ReturnType<typeof useProgress> | null>(null)

export function useProgressBar() {
  const progress = useContext(ProgressBarContext)

  if (progress === null) {
    throw new Error('Need to be inside provider')
  }

  return progress
}

export function useProgressRouter() {
  const progress = useProgressBar()
  const router = useRouter()

  return {
    ...router,
    push: (href: string, options?: Parameters<typeof router.push>[1]) => {
      progress.start()

      startTransition(() => {
        router.push(href, options)
        progress.done()
      })
    },
    replace: (href: string, options?: Parameters<typeof router.replace>[1]) => {
      progress.start()

      startTransition(() => {
        router.replace(href, options)
        progress.done()
      })
    },
    back: () => {
      progress.start()

      startTransition(() => {
        router.back()
        progress.done()
      })
    },
    forward: () => {
      progress.start()

      startTransition(() => {
        router.forward()
        progress.done()
      })
    },
    refresh: () => {
      progress.start()

      startTransition(() => {
        router.refresh()
        progress.done()
      })
    },
    prefetch: router.prefetch
  }
}

export function ProgressBar({ children }: { children: ReactNode }) {
  const progress = useProgress()

  return (
    <ProgressBarContext.Provider value={progress}>
      <Loader2Icon
        className={cn(
          'fixed top-1 right-1 size-5 animate-spin',
          progress.state !== 'complete' && progress.state !== 'initial'
            ? 'z-[100] scale-100 opacity-100'
            : 'z-[-1] scale-0 opacity-0'
        )}
      />

      {children}
    </ProgressBarContext.Provider>
  )
}

export function Link({ href, children, ...rest }: ComponentProps<typeof NextLink>) {
  const progress = useProgressBar()
  const router = useRouter()

  return (
    <NextLink
      href={href}
      onClick={e => {
        e.preventDefault()
        progress.start()

        startTransition(() => {
          router.push(href.toString())
          progress.done()
        })
      }}
      prefetch={true}
      {...rest}
    >
      {children}
    </NextLink>
  )
}

function useProgress() {
  const [state, setState] = useState<
    'initial' | 'in-progress' | 'completing' | 'complete'
  >('initial')

  const value = useSpring(0, {
    damping: 25,
    mass: 0.5,
    stiffness: 300,
    restDelta: 0.1
  })

  useInterval(
    () => {
      // If we start progress but the bar is currently complete, reset it first.
      if (value.get() === 100) {
        value.jump(0)
      }

      const current = value.get()

      let diff
      if (current === 0) {
        diff = 15
      } else if (current < 50) {
        diff = rand(1, 10)
      } else {
        diff = rand(1, 5)
      }

      value.set(Math.min(current + diff, 99))
    },
    state === 'in-progress' ? 750 : null
  )

  useEffect(() => {
    if (state === 'initial') {
      value.jump(0)
    } else if (state === 'completing') {
      value.set(100)
    }

    return value.on('change', latest => {
      if (latest === 100) {
        setState('complete')
      }
    })
  }, [value, state])

  function reset() {
    setState('initial')
  }

  function start() {
    setState('in-progress')
  }

  function done() {
    setState(state =>
      state === 'initial' || state === 'in-progress' ? 'completing' : state
    )
  }

  return { state, value, start, done, reset }
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (delay !== null) {
      tick()

      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
