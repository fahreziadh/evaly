import { NuqsAdapter } from 'nuqs/adapters/next/app'
import React from 'react'

const NuqsProvider = ({ children }: { children: React.ReactNode }) => {
  return <NuqsAdapter>{children}</NuqsAdapter>
}

export default NuqsProvider
