import { TRPCError } from '@trpc/server'
import React from 'react'

import DashboardSidebar from '@/components/shared/dashboard-sidebar'
import DashboardMobileNavbar from '@/components/shared/dashboard-sidebar/dashboard-mobile-navbar'

import { trpc } from '@/trpc/trpc.server'

import Provider from './provider'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const dataUser = await trpc.organization.profile().catch(error => {
    if (error instanceof TRPCError && error.code === 'UNAUTHORIZED') {
      return null
    }
    throw error
  })
  const isLoggedIn = !!dataUser

  return (
    <Provider isLoggedIn={isLoggedIn}>
      <DashboardSidebar />
      <main className="flex flex-1 flex-col">
        <DashboardMobileNavbar />
        {children}
      </main>
    </Provider>
  )
}

export default Layout
