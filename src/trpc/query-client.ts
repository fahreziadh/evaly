import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query'
import superjson from 'superjson'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // 1s, 2s, 4s, 8s, 16s, 30s
        retry: (failureCount, error) => {
          if (error?.message === 'UNAUTHORIZED') {
            return false
          }

          if (failureCount >= 3) {
            return false
          }

          return true
        }
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending'
      },
      hydrate: {
        deserializeData: superjson.deserialize
      }
    }
  })
}
