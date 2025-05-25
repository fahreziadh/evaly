'use client'

import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { FileSpreadsheet } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { parseAsInteger, useQueryStates } from 'nuqs'

import CardTest from '@/components/shared/card/card-test'
import DialogCreateTest from '@/components/shared/dialog/dialog-create-test'
import LoadingTest from '@/components/shared/loading/loading-test'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Separator } from '@/components/ui/separator'

import { trpc } from '@/trpc/trpc.client'

const DashboardPageClient = () => {
  const [queryStates, setQueryStates] = useQueryStates({
    limit: parseAsInteger.withDefault(100),
    page: parseAsInteger.withDefault(1)
  })
  const t = useTranslations('DashboardTest')

  const { data, isPending } = trpc.organization.test.getAll.useQuery({
    page: queryStates.page,
    limit: queryStates.limit
  })
  const queryClient = useQueryClient()
  const queryKey = getQueryKey(
    trpc.organization.test.getAll,
    {
      page: queryStates.page,
      limit: queryStates.limit
    },
    'query'
  )

  const tests = data?.data
  const pagination = data?.pagination

  if (isPending) {
    return (
      <div className="container">
        <div className="mb-10 flex flex-row items-start justify-between">
          <div>
            <h1 className="dashboard-title">{t('dashboardTitle')}</h1>
            <p className="dashboard-description">{t('dashboardDescription')}</p>
          </div>
          <DialogCreateTest />
        </div>
        <LoadingTest />
      </div>
    )
  }

  if (!tests || tests?.length === 0) {
    return (
      <div className="mt-[30vh] flex flex-col items-center justify-center text-center">
        <FileSpreadsheet className="text-muted-foreground mb-6 size-16" />
        <h1 className="text-xl font-medium">{t('noTestsYet')}</h1>
        <h2 className="text-muted-foreground mt-2 mb-4 max-w-md">
          {t('noTestsDescription')}
        </h2>
        <DialogCreateTest />
      </div>
    )
  }
  return (
    <div className="container">
      <div className="flex flex-row items-start justify-between">
        <div>
          <h1 className="dashboard-title">{t('dashboardTitle')}</h1>
          <p className="dashboard-description">{t('dashboardDescription')}</p>
        </div>
        <DialogCreateTest />
      </div>
      <div className="mt-10 flex min-h-dvh flex-col gap-4">
        <AnimatePresence>
          {tests.map(e => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.1 }}
            >
              <CardTest
                data={e}
                key={e.id}
                onDelete={() => {
                  const newData = tests.filter(test => test.id !== e.id)
                  queryClient.setQueryData(queryKey, {
                    data: newData,
                    pagination: {
                      ...pagination,
                      totalPages: newData.length
                    }
                  })
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {pagination?.totalPages && pagination?.totalPages > 1 ? (
        <>
          <Separator className="my-8" />
          <Pagination className="mt-8 justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (pagination.page > 1) {
                      setQueryStates(
                        prev => ({
                          ...prev,
                          page: prev.page - 1
                        }),
                        { scroll: true }
                      )
                    }
                  }}
                  disabled={pagination.page <= 1}
                />
              </PaginationItem>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                pageNum => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => {
                        setQueryStates(
                          prev => ({
                            ...prev,
                            page: pageNum
                          }),
                          { scroll: true }
                        )
                      }}
                      isActive={pageNum === pagination.page}
                      disabled={pageNum === pagination.page}
                      className={
                        pageNum === pagination.page ? 'disabled:opacity-100' : ''
                      }
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (pagination.page < pagination.totalPages) {
                      setQueryStates(
                        prev => ({
                          ...prev,
                          page: prev.page + 1
                        }),
                        { scroll: true }
                      )
                    }
                  }}
                  disabled={pagination.page >= pagination.totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : null}
    </div>
  )
}

export default DashboardPageClient
