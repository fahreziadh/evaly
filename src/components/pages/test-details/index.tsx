import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { Suspense, lazy, useEffect } from 'react'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import { TextShimmer } from '@/components/ui/text-shimmer'

import { NotFound } from '../not-found'
import Headers from './headers'
import Settings from './settings'
import Share from './share'

const Questions = lazy(() => import('./questions'))
const Results = lazy(() => import('./results'))

export default function TestsDetails() {
  const { tabs, testId, selectedSection, resultsTab } = useSearch({
    from: '/(organizer)/app/tests/details'
  })

  const dataTest = useQuery(api.organizer.test.getTestById, {
    testId: testId as Id<'test'>
  })

  const navigate = useNavigate({ from: '/app/tests/details' })
  const testSections = useQuery(api.organizer.testSection.getByTestId, {
    testId: testId as Id<'test'>
  })

  useEffect(() => {
    if (testSections?.length && !selectedSection && tabs === 'questions') {
      navigate({
        search: {
          tabs: 'questions',
          testId,
          selectedSection: testSections[0]._id,
          resultsTab
        },
        replace: true
      })
    }
  }, [testSections, navigate, testId, selectedSection, tabs])

  if (dataTest === null) {
    return <NotFound />
  }

  return (
    <Tabs
      value={tabs}
      onValueChange={value => {
        navigate({
          search: {
            tabs: value as 'questions' | 'results' | 'settings' | 'share',
            testId,
            selectedSection,
            resultsTab
          }
        })
      }}
    >
      <Headers />
      <div className="mt-2">
        <TabsContent value="questions">
          {selectedSection ? (
            <Suspense
              fallback={
                <TextShimmer className="h-full w-full">Loading section...</TextShimmer>
              }
            >
              <Questions
                selectedSectionId={selectedSection as Id<'testSection'>}
                testId={testId as Id<'test'>}
              />
            </Suspense>
          ) : (
            <TextShimmer className="h-full w-full">Loading section...</TextShimmer>
          )}
        </TabsContent>
        <TabsContent value="results">
          <Suspense
            fallback={
              <TextShimmer className="h-full w-full">Loading results...</TextShimmer>
            }
          >
            <Results />
          </Suspense>
        </TabsContent>
        <TabsContent value="settings">
          <Settings />
        </TabsContent>
        <TabsContent value="share">
          <Share testId={testId as Id<'test'>} />
        </TabsContent>
      </div>
    </Tabs>
  )
}
