'use client'

import { env } from '@/lib/env.client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import React, { useEffect } from 'react'

import { ProgressBar } from '../shared/progress-bar'
import NuqsProvider from './nuqs.provider'
import SuspendedPostHogPageView from './posthog-page-view'
import TanstackQueryProvider from './tanstack-query.provider'

const Provider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <TanstackQueryProvider>
        <NuqsProvider>
          <ProgressBar>
            <SuspendedPostHogPageView />
            {children}
          </ProgressBar>
        </NuqsProvider>
      </TanstackQueryProvider>
    </PHProvider>
  )
}

export default Provider
