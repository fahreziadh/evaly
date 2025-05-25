import { useParams } from 'next/navigation'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Filter, Info, Loader2, RefreshCw, Search } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect, useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { trpc } from '@/trpc/trpc.client'

import { columns } from './columns'
import { DataTable } from './data-table'
import { ExportDialog } from './export-dialog'
import { SubmissionDrawer } from './submission-drawer'
import { Section, Submission } from './types'

dayjs.extend(relativeTime)

const Submissions = () => {
  const params = useParams()
  const testId = params.id as string

  const [refetchInterval, setRefetchInterval] = useQueryState('refetchInterval', {
    defaultValue: 0,
    parse: value => parseInt(value),
    serialize: value => value.toString()
  })

  // Use nuqs for state management
  const [searchQuery, setSearchQuery] = useQueryState('search', {
    defaultValue: ''
  })

  // Local state to track search input directly
  const [localSearchInput, setLocalSearchInput] = useState(searchQuery || '')

  // Use a key to force re-render of DataTable when search changes
  const [tableKey, setTableKey] = useState(0)

  const [sectionParam, setSectionParam] = useQueryState('section', {
    defaultValue: 'all',
    parse: value => value,
    serialize: value => value
  })
  const [pageSize, setPageSize] = useQueryState('pageSize', {
    defaultValue: '20',
    parse: value => value,
    serialize: value => value
  })
  const [pageIndex, setPageIndex] = useQueryState('page', {
    defaultValue: '0',
    parse: value => value,
    serialize: value => value
  })
  const [sortColumn, setSortColumn] = useQueryState('sortColumn', {
    defaultValue: ''
  })
  const [sortDirection, setSortDirection] = useQueryState('sortDirection', {
    defaultValue: ''
  })

  // Local state for selected submission and section
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [selectedSection, setSelectedSection] = useState(sectionParam)

  // Sync local state with URL parameter
  useEffect(() => {
    setSelectedSection(sectionParam)
  }, [sectionParam])

  // Update URL parameter when local state changes
  const handleSectionChange = (value: string) => {
    console.log('Section selected:', value)
    setSelectedSection(value)
    setSectionParam(value)
  }

  // Fetch submissions data using the provided query hook
  const { data, isLoading, error, refetch, isFetching, dataUpdatedAt } =
    trpc.organization.test.getTestResults.useQuery(
      {
        id: testId
      },
      {
        enabled: !!testId,
        refetchInterval: refetchInterval
      }
    )

  // Extract submissions and sections from the response
  const submissions: Submission[] = useMemo(() => {
    if (!data?.submissions) return []

    return data.submissions.map(submission => {
      // Use the original string ID but remove the prefix for display
      const numericId = parseInt(submission.id.replace(/^ta-/, ''), 36) || 0

      // Get all section IDs that have at least one answer
      const sectionIds = Object.entries(submission.sectionAnswers || {})
        .filter(([, count]) => count > 0)
        .map(([sectionId]) => sectionId)

      return {
        id: numericId,
        name: submission.name,
        email: submission.email,
        image: submission.image,
        totalQuestions: submission.totalQuestions,
        answered: submission.answered,
        correct: submission.correct,
        wrong: submission.wrong,
        unanswered: submission.unanswered,
        submittedAt: submission.submittedAt,
        startedAt: submission.startedAt,
        score: submission.score,
        rank: submission.rank || 0,
        // Use the first section with answers as the primary section
        sectionId: sectionIds.length > 0 ? sectionIds[0] : 'all',
        // Keep section data as original string IDs
        sectionAnswers: submission.sectionAnswers || {},
        sectionCorrect: submission.sectionCorrect || {},
        sectionWrong: submission.sectionWrong || {},
        status: submission.status,
        sectionSubmitted: submission.sectionSubmitted || {}
      }
    }) as Submission[]
  }, [data?.submissions])

  const sections: Section[] = useMemo(() => {
    if (!data?.sections) return []

    return data.sections.map(section => ({
      // Keep the original string ID
      id: section.id,
      name: section.name,
      questionsCount: section.questionsCount
    }))
  }, [data?.sections])

  // Get unique sections from submissions
  const sectionsWithAll = useMemo(() => {
    // If there's only one section, just return that section
    if (sections.length === 1) {
      return sections
    }

    // Otherwise return all sections with an "All Sections" option
    return [{ id: 'all', name: 'All Sections', questionsCount: 0 }, ...sections]
  }, [sections])

  // Filter data based on section and search query
  const filteredData = useMemo(() => {
    let filtered = [...submissions]

    // Filter by section if not "all"
    if (selectedSection !== 'all') {
      filtered = filtered
        .filter(submission => {
          const sectionAnswers = submission.sectionAnswers || {}
          const answerCount = sectionAnswers[selectedSection] || 0
          return answerCount > 0
        })
        .map(submission => {
          // Extract section-specific data
          const sectionAnswers = submission.sectionAnswers?.[selectedSection] || 0
          const sectionCorrect = submission.sectionCorrect?.[selectedSection] || 0
          const sectionWrong = submission.sectionWrong?.[selectedSection] || 0
          const sectionQuestionsCount =
            sections.find(s => s.id === selectedSection)?.questionsCount || 0
          const sectionSubmitted =
            submission.sectionSubmitted?.[selectedSection] || null

          // Calculate derived values
          const sectionUnanswered = sectionQuestionsCount - sectionAnswers
          const sectionScore =
            sectionQuestionsCount > 0
              ? Math.round((sectionCorrect / sectionQuestionsCount) * 100)
              : 0

          return {
            ...submission,
            answered: sectionAnswers,
            correct: sectionCorrect,
            wrong: sectionWrong,
            unanswered: sectionUnanswered,
            score: sectionScore,
            totalQuestions: sectionQuestionsCount,
            submittedAt: sectionSubmitted
          }
        })
      console.log(filtered)
    }

    // Filter by search query
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        submission =>
          (submission.name && submission.name.toLowerCase().includes(query)) ||
          (submission.email && submission.email.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [submissions, searchQuery, selectedSection, sections])

  // Calculate ranks based on score (if not already provided by the API)
  const dataWithRanks = useMemo(() => {
    // If the API already provides ranks, use those
    if (submissions.length > 0 && submissions[0].rank) {
      return filteredData
    }

    // Otherwise, calculate ranks based on score and submission time
    const sortedData = [...filteredData].sort((a, b) => {
      // First sort by score (descending)
      if (b.score !== a.score) {
        return b.score - a.score
      }

      // If scores are equal, sort by submission time (earlier submissions rank higher)
      // Earlier date = smaller timestamp = should come first in the sort
      if (a.submittedAt && b.submittedAt) {
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      }

      // If one has submittedAt and the other doesn't, prioritize the submitted one
      if (a.submittedAt && !b.submittedAt) return -1
      if (!a.submittedAt && b.submittedAt) return 1

      return 0
    })

    return sortedData.map((item, index) => ({
      ...item,
      rank: index + 1
    }))
  }, [filteredData, submissions])

  // Handle pagination state changes
  const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(String(newPageIndex))
    setPageSize(String(newPageSize))
    // Force DataTable to re-render after pagination changes
    setTableKey(prev => prev + 1)
  }

  // Handle sorting state changes
  const handleSortingChange = (columnId: string, direction: 'asc' | 'desc' | '') => {
    setSortColumn(columnId)
    setSortDirection(direction)
    // Force DataTable to re-render after sorting changes
    setTableKey(prev => prev + 1)
  }

  // Reset pagination when filters change
  useEffect(() => {
    setPageIndex('0')
  }, [selectedSection, searchQuery, setPageIndex])

  // Handle manual refresh
  const handleRefresh = () => {
    refetch()
  }

  // Update search query with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearchInput)
      // Force DataTable to re-render after search query changes
      setTableKey(prev => prev + 1)
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearchInput, setSearchQuery])

  // Simple search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchInput(e.target.value)
  }

  // Force re-render when sorting/filtering URL params change
  useEffect(() => {
    setTableKey(prev => prev + 1)
  }, [sortColumn, sortDirection, searchQuery, selectedSection, pageIndex, pageSize])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <span className="ml-2">Loading submissions...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-destructive flex h-64 flex-col items-center justify-center">
        <p className="mb-4">Error loading submissions. Please try again.</p>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">Submissions</h2>
          <Badge variant={'secondary'}>Total: {dataWithRanks.length}</Badge>
          {searchQuery && searchQuery.trim() !== '' && (
            <Badge variant="outline" className="ml-1">
              Search: {`"${searchQuery}"`}
            </Badge>
          )}
          {selectedSection !== 'all' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="ml-1 cursor-help">
                    {sections.find(s => s.id === selectedSection)?.name || 'Section'}{' '}
                    view
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Showing section-specific data (answered, correct, wrong, score)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="text-muted-foreground h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Click on any row to view detailed submission information</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>

          <Select
            value={refetchInterval.toString()}
            onValueChange={value => setRefetchInterval(parseInt(value))}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className="w-max">
                  <SelectValue placeholder="Select refetch interval" />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent>
                {`Last updated: ${dayjs(dataUpdatedAt).fromNow()}`}
              </TooltipContent>
            </Tooltip>

            <SelectContent>
              <SelectItem value="0">
                <Label className="text-xs">Auto Refresh: </Label>Off
              </SelectItem>
              <SelectItem value="5000">
                <Label className="text-xs">Auto Refresh: </Label>5 seconds
              </SelectItem>
              <SelectItem value="60000">
                <Label className="text-xs">Auto Refresh: </Label>1 minute
              </SelectItem>
              <SelectItem value="300000">
                <Label className="text-xs">Auto Refresh: </Label>5 minutes
              </SelectItem>
              <SelectItem value="1800000">
                <Label className="text-xs">Auto Refresh: </Label>30 minutes
              </SelectItem>
              <SelectItem value="3600000">
                <Label className="text-xs">Auto Refresh: </Label>1 hour
              </SelectItem>
            </SelectContent>
          </Select>

          {sectionsWithAll.length > 1 && (
            <Select value={selectedSection} onValueChange={handleSectionChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map((section, index) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name || `Section ${index + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {sectionsWithAll.length === 1 && sectionsWithAll[0].name && (
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <Filter className="h-4 w-4" />
              {sectionsWithAll[0].name}
            </div>
          )}
          <div className="relative w-full sm:w-[300px]">
            <Search className="text-muted-foreground absolute top-2 left-2.5 size-3.5" />
            <Input
              placeholder="Search participants..."
              value={localSearchInput}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
          {/* Export Dialog Component */}
          <ExportDialog data={dataWithRanks} testName={`Test ${testId}`} />
        </div>
      </div>

      <DataTable
        key={tableKey}
        columns={columns}
        data={dataWithRanks}
        onRowClick={setSelectedSubmission}
        pageIndex={Number(pageIndex)}
        pageSize={Number(pageSize)}
        onPaginationChange={handlePaginationChange}
        sortColumn={sortColumn}
        sortDirection={sortDirection as 'asc' | 'desc' | ''}
        onSortingChange={handleSortingChange}
      />

      <SubmissionDrawer
        submission={selectedSubmission}
        open={!!selectedSubmission}
        onOpenChange={open => !open && setSelectedSubmission(null)}
        sections={sections}
        testId={testId}
      />
    </div>
  )
}

export default Submissions
