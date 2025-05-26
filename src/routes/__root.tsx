import { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Outlet,
  type ReactNode,
  Scripts,
  createRootRouteWithContext,
  useRouterState
} from '@tanstack/react-router'

import { NotFound } from '@/components/pages/not-found.tsx'

import { cn } from '@/lib/utils.ts'

import { Toaster } from '../components/ui/sonner.tsx'
import appCss from '../styles/app.css?url'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        title: 'Evaly'
      }
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss
      },
      { rel: 'icon', href: '/favicon.ico' }
    ]
  }),
  notFoundComponent: () => <NotFound />
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}
function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const status = useRouterState()

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body
        className={cn('font-sans antialiased', status.isLoading ? 'animate-pulse' : '')}
      >
        {children}
        <Toaster position="top-center" />
        {/* <TanStackRouterDevtools /> */}
        <Scripts />
      </body>
    </html>
  )
}
