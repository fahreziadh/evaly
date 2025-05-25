'use client'

import supabase from '@/lib/supabase'
import { User } from 'better-auth'
import { useEffect } from 'react'

const Presence = ({ testId, user }: { testId: string; user: User }) => {
  useEffect(() => {
    const channel = supabase.channel(testId, {
      config: {
        presence: {
          key: user.email
        }
      }
    })

    channel.subscribe(status => {
      if (status === 'SUBSCRIBED') {
        channel.track({
          online_at: new Date().toISOString()
        })
      }
    })

    return () => {
      channel.unsubscribe()
    }
  }, [testId, user.email])
  return <></>
}

export default Presence
