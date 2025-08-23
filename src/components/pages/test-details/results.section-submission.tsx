import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "convex-helpers/react/cache";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useSearch } from "@tanstack/react-router";
import LoadingScreen from "@/components/shared/loading-screen";

export type TestSubmission = {
  participantId: Id<"users">;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  isCompleted: boolean;
  completedSectionsCount: number;
  completedAt?: number;
  attempts: any[];
};

interface ResultSectionSubmissionProps {
  testId?: Id<"test">;
}

export default function ResultSectionSubmission({ testId }: ResultSectionSubmissionProps) {
  const search = useSearch({ from: "/(organizer)/app/tests/details" });
  const actualTestId = testId || (search.testId as Id<"test">);
  
  const results = useQuery(api.organizer.testResult.getResultsWithScores, {
    testId: actualTestId,
  });

  const calculateScore = useMutation(api.organizer.testResult.calculateAndStoreScore);
  const [calculating, setCalculating] = React.useState<string | null>(null);

  const handleRecalculateScore = async (participantId: Id<"users">, attempts: any[]) => {
    setCalculating(participantId);
    try {
      for (const attempt of attempts.filter(a => a.finishedAt)) {
        await calculateScore({ testAttemptId: attempt._id });
      }
    } catch (error) {
      console.error("Failed to recalculate score:", error);
      alert("Failed to recalculate score. Please try again.");
    } finally {
      setCalculating(null);
    }
  };

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-green-600 bg-green-50 border-green-200";
      case "B": return "text-blue-600 bg-blue-50 border-blue-200";
      case "C": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "D": return "text-orange-600 bg-orange-50 border-orange-200";
      case "F": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const columns: ColumnDef<TestSubmission>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "participantId",
      header: "Participant",
      cell: ({ row }) => (
        <div className="font-medium">
          Participant {row.getValue<Id<"users">>("participantId").slice(-6)}
        </div>
      ),
    },
    {
      accessorKey: "percentage",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const percentage = row.getValue<number>("percentage");
        const totalScore = row.original.totalScore;
        const maxScore = row.original.maxPossibleScore;
        const grade = getLetterGrade(percentage);
        
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{totalScore}/{maxScore}</span>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(grade)}`}>
                {grade}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "isCompleted",
      header: "Status",
      cell: ({ row }) => {
        const isCompleted = row.getValue<boolean>("isCompleted");
        const completedSections = row.original.completedSectionsCount;
        const totalSections = row.original.attempts.length;
        
        return (
          <div className="space-y-1">
            <Badge variant={isCompleted ? "success" : "secondary"}>
              {isCompleted ? "Completed" : "In Progress"}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {completedSections}/{totalSections} sections
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "completedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Submitted At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const completedAt = row.getValue<number | undefined>("completedAt");
        return (
          <div className="text-sm">
            {completedAt 
              ? new Date(completedAt).toLocaleString()
              : "Not completed"
            }
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const submission = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(submission.participantId)}
              >
                Copy participant ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleRecalculateScore(submission.participantId, submission.attempts)}
                disabled={calculating === submission.participantId}
              >
                <Eye className="mr-2 h-4 w-4" />
                {calculating === submission.participantId ? "Recalculating..." : "Recalculate Score"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Individual Results
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "percentage", desc: true } // Default sort by highest score
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: results || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (results === undefined) {
    return <LoadingScreen />;
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-4">
          No submissions found for this test.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter participants..."
          value={(table.getColumn("participantId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("participantId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}