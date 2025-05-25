'use client'

// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from '@tanstack/react-query'
import { createTRPCReact } from '@trpc/react-query'

import { AppRouter } from './app-router'
import { makeQueryClient } from './query-client'

export const trpc = createTRPCReact<AppRouter>()

let clientQueryClientSingleton: QueryClient

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= makeQueryClient())
}
export function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return ''
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    return process.env.NEXT_PUBLIC_URL
  })()
  return `${base}/api/trpc`
}
