import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: TData) => void
  pageIndex?: number
  pageSize?: number
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
  sortColumn?: string
  sortDirection?: 'asc' | 'desc' | ''
  onSortingChange?: (columnId: string, direction: 'asc' | 'desc' | '') => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  pageIndex = 0,
  pageSize = 10,
  onPaginationChange,
  sortColumn = '',
  sortDirection = '',
  onSortingChange
}: DataTableProps<TData, TValue>) {
  // Convert external sorting props to TanStack's SortingState
  const initialSorting: SortingState =
    sortColumn && sortDirection
      ? [{ id: sortColumn, desc: sortDirection === 'desc' }]
      : []

  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex,
    pageSize
  })

  // Update internal state when props change
  useEffect(() => {
    setPagination({
      pageIndex,
      pageSize
    })
  }, [pageIndex, pageSize])

  useEffect(() => {
    if (sortColumn && sortDirection) {
      setSorting([{ id: sortColumn, desc: sortDirection === 'desc' }])
    } else {
      setSorting([])
    }
  }, [sortColumn, sortDirection])

  // Handle internal state changes and propagate to parent
  const handleSortingChange: OnChangeFn<SortingState> = updaterOrValue => {
    // Handle both function updater and direct value
    const updatedSorting =
      typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue

    setSorting(updatedSorting)

    if (onSortingChange) {
      const column = updatedSorting.length > 0 ? updatedSorting[0].id : ''
      const direction =
        updatedSorting.length > 0 ? (updatedSorting[0].desc ? 'desc' : 'asc') : ''
      onSortingChange(column, direction)
    }
  }

  const handlePaginationChange: OnChangeFn<PaginationState> = updaterOrValue => {
    // Handle both function updater and direct value
    const updatedPagination =
      typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue

    setPagination(updatedPagination)

    if (onPaginationChange) {
      onPaginationChange(updatedPagination.pageIndex, updatedPagination.pageSize)
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: handleSortingChange,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: handlePaginationChange,
    state: {
      sorting,
      columnFilters,
      pagination
    }
  })

  // Calculate page numbers for pagination
  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex + 1

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (pageCount <= maxVisiblePages) {
      // Show all pages if there are few pages
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(pageCount - 1, currentPage + 1)

      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        endPage = 4
      } else if (currentPage >= pageCount - 1) {
        startPage = pageCount - 3
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('ellipsis-start')
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (endPage < pageCount - 1) {
        pages.push('ellipsis-end')
      }

      // Always show last page
      pages.push(pageCount)
    }

    return pages
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="relative rounded-md border border-dashed">
        <ScrollArea className="w-full rounded-md whitespace-nowrap">
          <Table>
            <TableHeader className="bg-secondary">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="divide-y divide-dashed">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    className={onRowClick ? 'h-16 cursor-pointer hover:opacity-80' : ''}
                    onClick={() => onRowClick && onRowClick(row.original)}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-xs">
          Showing{' '}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{' '}
          to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            data.length
          )}{' '}
          of {data.length} entries
        </div>

        {pageCount > 1 && (
          <div className="flex items-center space-x-2">
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={value => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className={
                      !table.getCanPreviousPage() ? 'cursor-not-allowed opacity-50' : ''
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, i) => {
                  if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                    return (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  return (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => table.setPageIndex(Number(page) - 1)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className={
                      !table.getCanNextPage() ? 'cursor-not-allowed opacity-50' : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
