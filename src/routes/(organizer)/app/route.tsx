import { api } from '@convex/_generated/api'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AuthLoading, Authenticated, Unauthenticated, useQuery } from 'convex/react'

import LoginOrganizerPage from '@/components/pages/login-organizer'
import OrganizerOnboarding from '@/components/pages/organizer-onboarding'
import DashboardSidebar from '@/components/shared/dashboard-sidebar/dashboard-sidebar'
import LoadingScreen from '@/components/shared/loading-screen'

export const Route = createFileRoute('/(organizer)/app')({
  component: App,
  head: () => ({
    meta: [
      {
        title: 'Evaly Dashboard'
      },
      {
        name: 'description',
        content: 'Evaly - Create and manage your tests'
      }
    ]
  })
})

function App() {
  const user = useQuery(api.organizer.profile.getProfile)
  return (
    <>
      <AuthLoading>
        <LoadingScreen />
      </AuthLoading>
      <Unauthenticated>
        <LoginOrganizerPage />
      </Unauthenticated>
      <Authenticated>
        {user && !user?.selectedOrganizationId ? (
          <OrganizerOnboarding defaultFullname={user?.name} />
        ) : (
          <div className="container flex flex-row gap-10">
            {/* <DashboardNavbar /> */}
            <DashboardSidebar className="sticky top-0 h-dvh w-[240px] pt-10 pb-5" />
            <main className="flex-1 pt-10 pb-5">
              <Outlet />
            </main>
          </div>
        )}
      </Authenticated>
    </>
  )
}
