import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import type { DataModel } from '@convex/_generated/dataModel'
import { useParams } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TextShimmer } from '@/components/ui/text-shimmer'

import usePresence from '@/hooks/presence/use-presence'

import { AccountDropdown } from './navbar.lobby'

const NavbarAttempt = ({ user }: { user: DataModel['users']['document'] }) => {
  const { attemptId, testId } = useParams({
    from: '/(participant)/s/$testId/$attemptId'
  })

  const testAttempt = useQuery(api.participant.testAttempt.getById, {
    id: attemptId as Id<'testAttempt'>
  })

  const { updateData } = usePresence(testId as Id<'test'>, user._id, {})

  useEffect(() => {
    if (!testAttempt) {
      return
    }

    updateData({
      data: {
        testId: testId as Id<'test'>,
        testSectionId: testAttempt.testSectionId
      }
    })
  }, [testAttempt])

  return (
    <div className="flex h-14 w-full flex-row justify-between px-4">
      <div className="flex flex-row items-start gap-2 pt-2">
        <TestSectionDropdown />
      </div>
      <div className="flex flex-row items-center gap-2">
        <AccountDropdown user={user} />
      </div>
    </div>
  )
}

const TestSectionDropdown = () => {
  const { testId, attemptId } = useParams({
    from: '/(participant)/s/$testId/$attemptId'
  })

  const testAttempt = useQuery(api.participant.testAttempt.getById, {
    id: attemptId as Id<'testAttempt'>
  })
  const testSections = useQuery(api.participant.testSection.getByTestId, {
    testId: testId as Id<'test'>
  })

  const selectedTestSection = testAttempt?.testSectionId

  if (testSections === undefined) {
    return <TextShimmer>Loading...</TextShimmer>
  }

  if (testSections.length === 1) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'}>
          {testSections?.find(section => section._id === selectedTestSection)?.title ||
            `Section 1`}
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}
export default NavbarAttempt
