import { createFileRoute } from '@tanstack/react-router'

import Whistlist from '@/components/pages/whistlist'

export const Route = createFileRoute('/')({
  component: Whistlist,
  head: () => ({
    meta: [
      {
        title: 'Evaly'
      }
    ]
  })
})
