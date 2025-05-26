import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AuthLoading, Authenticated, Unauthenticated } from 'convex/react'

import LoginParticipantPage from '@/components/pages/login-participant'
import LoadingScreen from '@/components/shared/loading-screen'

export const Route = createFileRoute('/(participant)')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <>
      <AuthLoading>
        <LoadingScreen />
      </AuthLoading>
      <Unauthenticated>
        <LoginParticipantPage />
      </Unauthenticated>
      <Authenticated>
        <Outlet />
      </Authenticated>
    </>
  )
}
