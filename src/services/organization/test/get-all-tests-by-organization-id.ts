import db from '@/lib/db'
import { test, testInvitation, testSection } from '@/lib/db/schema'
import { SQL, sql } from 'drizzle-orm'
import { and, between, eq, inArray, isNull, like, or } from 'drizzle-orm'

import { Pagination } from '@/types/pagination'
import { Test } from '@/types/test'

export async function getAllTestsByOrganizationId({
  organizationId,
  sort = 'desc-create',
  page = 1,
  limit = 10,
  search = '',
  startDate,
  endDate
}: {
  organizationId: string
  page?: number
  limit?: number
  sort?: 'asc-create' | 'desc-create' | 'asc-held' | 'desc-held'
  search?: string
  startDate?: Date
  endDate?: Date
}) {
  const offset = (page - 1) * limit

  // Build where conditions
  const whereConditions: SQL[] = [
    eq(test.organizationId, organizationId),
    isNull(test.deletedAt)
  ]

  // Add search condition if search term is provided
  if (search) {
    const searchCondition = or(
      like(sql`${test.title}`, `%${search}%`),
      like(sql`${test.description}`, `%${search}%`)
    ) as SQL

    whereConditions.push(searchCondition)
  }

  // Add date range condition if dates are provided
  if (startDate && endDate) {
    whereConditions.push(
      between(test.heldAt, startDate.toISOString(), endDate.toISOString())
    )
  }

  // Fetch tests
  const tests = await db.query.test.findMany({
    where: (_, { and }) => and(...whereConditions),
    limit,
    offset,
    orderBy: (fields, { asc, desc }) => {
      switch (sort) {
        case 'asc-create':
          return [asc(fields.createdAt)]
        case 'desc-create':
          return [desc(fields.createdAt)]
        case 'asc-held':
          return [asc(fields.heldAt)]
        case 'desc-held':
          return [desc(fields.heldAt)]
        default:
          return [desc(fields.createdAt)]
      }
    }
  })

  // Get total count using SQL count
  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)`
    })
    .from(test)
    .where(and(...whereConditions))

  // If we have tests, fetch their durations and invitation counts in single queries
  let testsWithExtras: Test[] = []

  if (tests.length > 0) {
    // Get all test IDs
    const testIds = tests.map(t => t.id)

    try {
      // Fetch the sum of durations for each test in a single query
      const testDurations = await db
        .select({
          testId: testSection.testId,
          totalDuration: sql<number>`COALESCE(SUM(${testSection.duration}), 0)`
        })
        .from(testSection)
        .where(and(inArray(testSection.testId, testIds), isNull(testSection.deletedAt)))
        .groupBy(testSection.testId)

      // Create a map of test ID to duration for quick lookup
      const durationMap = new Map<string, number>()
      testDurations.forEach(item => {
        durationMap.set(item.testId, item.totalDuration)
      })

      // Get invite-only test IDs
      const inviteOnlyTestIds = tests
        .filter(t => t.access === 'invite-only')
        .map(t => t.id)

      // Only fetch invitation counts for invite-only tests
      const invitationCountMap = new Map<string, number>()

      if (inviteOnlyTestIds.length > 0) {
        // Fetch the count of invitations for each invite-only test
        const invitationCounts = await db
          .select({
            testId: testInvitation.testId,
            count: sql<number>`COUNT(*)`
          })
          .from(testInvitation)
          .where(inArray(testInvitation.testId, inviteOnlyTestIds))
          .groupBy(testInvitation.testId)

        // Create a map of test ID to invitation count
        invitationCounts.forEach(item => {
          invitationCountMap.set(item.testId, item.count)
        })
      }

      // Combine the test data with durations and invitation counts
      testsWithExtras = tests.map(test => ({
        ...test,
        duration: durationMap.get(test.id) || 0,
        // Only set invitations for invite-only tests
        invitations:
          test.access === 'invite-only'
            ? invitationCountMap.get(test.id) || 0
            : undefined
      }))
    } catch (error) {
      // Fallback: return tests with zero duration and undefined invitations
      testsWithExtras = tests.map(test => ({
        ...test,
        duration: 0,
        invitations: test.access === 'invite-only' ? 0 : undefined
      }))

      console.error('Error fetching test durations and invitations:', error)
    }
  } else {
    testsWithExtras = []
  }

  const pagination: Pagination = {
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit)
  }

  return {
    data: testsWithExtras,
    pagination
  }
}
