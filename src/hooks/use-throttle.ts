import { useEffect, useRef, useState } from 'react'

/**
 * A hook that returns a throttled version of the provided value.
 * The throttled value only updates at most once per the specified delay interval.
 *
 * @param value The value to throttle
 * @param delay The throttle delay in milliseconds (default: 500ms)
 * @returns The throttled value
 */
export function useThrottle<T>(value: T, delay = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastUpdateRef = useRef<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const now = Date.now()
    const elapsed = now - lastUpdateRef.current

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // If enough time has elapsed since the last update, update immediately
    if (elapsed >= delay) {
      lastUpdateRef.current = now
      setThrottledValue(value)
    } else {
      // Otherwise, schedule an update for when the delay has passed
      timeoutRef.current = setTimeout(() => {
        lastUpdateRef.current = Date.now()
        setThrottledValue(value)
        timeoutRef.current = null
      }, delay - elapsed)
    }

    // Clean up timeout on unmount or when deps change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay])

  return throttledValue
}
