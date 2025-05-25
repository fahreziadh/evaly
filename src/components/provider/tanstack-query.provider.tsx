'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { httpLink } from '@trpc/client'
import { useState } from 'react'

import { getQueryClient, getUrl, trpc } from '@/trpc/trpc.client'

const TanstackQueryProvider = ({ children }: { children: React.ReactNode }) => {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: getUrl()
        })
        // splitLink({
        //   condition: (op) => isNonJsonSerializable(op.input),
        //   true: httpLink({
        //     url: getUrl(),
        //   }),
        //   false: httpBatchLink({
        //     url: getUrl(),
        //   })
        // }),
      ]
    })
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default TanstackQueryProvider
