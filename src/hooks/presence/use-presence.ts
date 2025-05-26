import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import type { Value } from 'convex/values'
import { useCallback, useEffect, useState } from 'react'

import useSingleFlight from './use-single-flight'

export type PresenceData<D> = {
  created: number
  latestJoinedAt: number
  participantId: string
  data: D
  present: boolean
}

const HEARTBEAT_PERIOD = 4_000

/**
 * usePresence is a React hook for reading & writing presence data.
 *
 * The data is written by various users, and comes back as a list of data for
 * other users in the same room. It is not meant for mission-critical data, but
 * rather for optimistic metadata, like whether a user is online, typing, or
 * at a certain location on a page. The data is single-flighted, and when many
 * updates are requested while an update is in flight, only the latest data will
 * be sent in the next request. See for more details on single-flighting:
 * https://stack.convex.dev/throttling-requests-by-single-flighting
 *
 * Data updates are merged with previous data. This data will reflect all
 * updates, not just the data that gets synchronized to the server. So if you
 * update with {mug: userMug} and {typing: true}, the data will have both
 * `mug` and `typing` fields set, and will be immediately reflected in the data
 * returned as the first parameter.
 *
 * @param testId - The test associated with the presence data.
 * @param participantId - The participant associated with the presence data.
 * @param initialData - The initial data to associate with the user.
 * @param heartbeatPeriod? - If specified, the interval between heartbeats, in
 * milliseconds. A heartbeat updates the user's presence "updated" timestamp.
 * The faster the updates, the more quickly you can detect a user "left" at
 * the cost of more server function calls.
 * @returns A list with 1. this user's data; 2. A list of other users' data;
 * 3. function to update this user's data. It will do a shallow merge.
 */
export const usePresence = <T extends { [key: string]: Value }>(
  testId: Id<'test'>,
  participantId: string,
  initialData: T,
  heartbeatPeriod = HEARTBEAT_PERIOD
) => {
  const [data, setData] = useState(initialData)
  let presence = useQuery(api.participant.testPresence.list, {
    testId: testId as Id<'test'>
  })

  if (presence) {
    presence = presence.filter(p => p.participantId !== participantId)
  }

  const updatePresence = useSingleFlight(
    useMutation(api.participant.testPresence.update)
  )
  const heartbeat = useSingleFlight(useMutation(api.participant.testPresence.heartbeat))

  // Initial update and signal departure when we leave.
  useEffect(() => {
    void updatePresence({ testId, participantId, data })
    void heartbeat({ testId, participantId })
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      void heartbeat({ testId, participantId })
    }, heartbeatPeriod)
    // Whenever we have any data change, it will get cleared.
    return () => clearInterval(intervalId)
  }, [heartbeat, testId, participantId, heartbeatPeriod])

  // Updates the data, merged with previous data state.
  const updateData = useCallback(
    (patch: Partial<T>) => {
      setData(prevState => {
        const data = { ...prevState, ...patch }
        void updatePresence({ testId, participantId, data })
        return data
      })
    },
    [testId, participantId, updatePresence]
  )

  return { data, presence, updateData } as const
}

export default usePresence
