import { redirect } from 'next/navigation'

import React from 'react'

import { trpc } from '@/trpc/trpc.server'

import Presence from './presence'

const layout = async ({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ testId: string }>
}) => {
  const { testId } = await params
  const { user } = await trpc.participant.profile()

  if (!user) {
    redirect(`/login?callbackURL=/s/${testId}`)
  }

  return (
    <>
      <Presence testId={testId} user={user} />
      {children}
    </>
  )
}

export default layout
