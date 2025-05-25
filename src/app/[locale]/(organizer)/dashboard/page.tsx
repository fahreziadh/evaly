'use client'

import { Suspense } from 'react'

import DashboardPageClient from './page.client'

export const dynamic = 'force-static'

const Page = () => {
  return (
    <div className="dashboard-margin">
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardPageClient />
      </Suspense>
    </div>
  )
}
export default Page
