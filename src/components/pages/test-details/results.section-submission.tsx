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
import { ArrowUpDown, MoreHorizontal, Eye, Download, FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
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
import { useQuery } from "convex-helpers/react/cache";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useSearch } from "@tanstack/react-router";
import LoadingScreen from "@/components/shared/loading-screen";

export type TestSubmission = {
  participantId: Id<"users">;
  participantName?: string;
  participantImage?: string;
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

  const handleExportCSV = () => {
    if (!results) return;
    
    // Create CSV content
    const headers = ["Rank", "Participant", "Score", "Max Score", "Percentage", "Completed At", "Status"];
    const sortedResults = [...results].sort((a, b) => b.percentage - a.percentage);
    const rows = sortedResults.map((result, index) => [
      index + 1,
      result.participantName || `Participant ${result.participantId.slice(-6)}`,
      result.totalScore,
      result.maxPossibleScore,
      `${result.percentage}%`,
      result.completedAt ? new Date(result.completedAt).toLocaleString() : "Not completed",
      result.isCompleted ? "Completed" : "In Progress"
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
    
    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `test-submissions-${actualTestId}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportJSON = () => {
    // Disabled for now - placeholder
    alert("JSON export coming soon!");
  };

  const handleExportPDF = () => {
    // Disabled for now - placeholder
    alert("PDF export coming soon!");
  };


  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes <= 1 ? "Just now" : `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    }
    
    return new Date(timestamp).toLocaleDateString();
  };

  const columns: ColumnDef<TestSubmission>[] = [
    {
      accessorKey: "participantId",
      header: "Participant",
      cell: ({ row }) => {
        const participantName = row.original.participantName;
        const participantImage = row.original.participantImage;
        const participantId = row.getValue<Id<"users">>("participantId");
        
        return (
          <div className="flex items-center space-x-3">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {participantImage ? (
                <img 
                  src={participantImage} 
                  alt={participantName || 'Participant'} 
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-muted-foreground">
                  {participantName ? 
                    participantName.slice(0, 2).toUpperCase() : 
                    participantId.slice(-2).toUpperCase()
                  }
                </span>
              )}
            </div>
            <div>
              <div className="font-medium">
                {participantName || `Participant ${participantId.slice(-6)}`}
              </div>
              <div className="text-xs text-muted-foreground">
                ID: {participantId.slice(-8)}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "percentage",
      header: ({ column }) => {
        return (
          <div className="text-right pr-6">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="ml-auto"
            >
              Score
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const percentage = row.getValue<number>("percentage");
        const totalScore = row.original.totalScore;
        const maxScore = row.original.maxPossibleScore;
        
        return (
          <div className="text-right pr-6">
            <div className="font-semibold text-lg">{percentage}%</div>
            <div className="text-sm text-muted-foreground">{totalScore}/{maxScore}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "isCompleted",
      header: "Status",
      cell: ({ row }) => {
        const isCompleted = row.getValue<boolean>("isCompleted");
        
        return (
          <Badge variant={isCompleted ? "default" : "secondary"} className="font-medium">
            {isCompleted ? "Completed" : "In Progress"}
          </Badge>
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
            Completed
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const completedAt = row.getValue<number | undefined>("completedAt");
        return (
          <div className="text-sm">
            {completedAt 
              ? formatTimeAgo(completedAt)
              : <span className="text-muted-foreground">-</span>
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
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search participants..."
          value={(table.getColumn("participantId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("participantId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportCSV}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJSON} disabled>
              <FileText className="mr-2 h-4 w-4" />
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPDF} disabled>
              <FileText className="mr-2 h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b bg-muted/50 hover:bg-muted/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">
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
                  className="border-b transition-colors hover:bg-muted/50"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4">
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
                  className="h-24 px-4 py-6 text-center text-muted-foreground"
                >
                  No submissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {results?.length || 0} submissions
        </div>
        <div className="flex space-x-2">
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