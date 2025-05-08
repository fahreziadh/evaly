import { ColumnDef, Column } from "@tanstack/react-table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Submission } from "./types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Image } from "@/components/ui/image";

dayjs.extend(relativeTime);

// Consistent header component to ensure all headers look the same
const SortableHeader = ({
  column,
  title,
  className,
}: {
  column: Column<Submission, unknown>;
  title: string;
  className?: string;
}) => {
  const sortDirection = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sortDirection === "asc")}
      className={cn(
        "w-max cursor-pointer text-sm px-0 font-normal flex items-center gap-1",
        className
      )}
    >
      {title}
      {sortDirection === false && <ArrowUpDown className="size-3 invisible" />}
      {sortDirection === "asc" && <ArrowUp className="size-3" />}
      {sortDirection === "desc" && <ArrowDown className="size-3" />}
    </button>
  );
};

export const columns: ColumnDef<Submission>[] = [
  {
    accessorKey: "rank",
    header: ({ column }) => (
      <SortableHeader column={column} title="Rank" className="w-[50px] pl-4" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium pl-4">#{row.original.rank}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Participant"
        className="min-w-[180px]"
      />
    ),
    cell: ({ row }) => {
      return <div className="flex items-center gap-2">
        <Avatar className="size-6">
          {row.original.image && (
                        <Image src={row.original.image} alt={row.original.name} width={32} height={32} className="rounded-full size-8" />
          )}
          <AvatarFallback>
            {row.original.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="font-medium">{row.original.name}</div>
      </div>;
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => <SortableHeader column={column} title="Score" />,
    cell: ({ row }) => {
      const score = row.original.score as number;

      return <div className={cn("")}>{`${score}%`}</div>;
    },
  },
  {
    accessorKey: "correct",
    header: ({ column }) => <SortableHeader column={column} title="Result" />,
    cell: ({ row }) => {
      const correct = row.original.correct as number;
      const wrong = row.original.wrong as number;
      const unanswered = row.original.unanswered as number;
      const status = row.original.status;

      return (
        <div className="flex flex-row gap-2">
          <Badge variant={"success"}>
            Correct: <span className="font-bold">{correct}</span>
          </Badge>
          <Badge
            variant={"success"}
            className="bg-red-400/10 text-red-400 border-red-500/10"
          >
            Wrong: <span className="font-bold">{wrong}</span>
          </Badge>
          {unanswered > 0 && (
            <Badge variant={"secondary"}>
              {status === "test-ended" || status === "completed" ? "Skipped: " : "Pending: "}
              <span className="font-bold">{unanswered}</span>
            </Badge>
          )}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "answered",
  //   header: ({ column }) => <SortableHeader column={column} title="Answered" />,
  //   cell: ({ row }) => (
  //     <div className="text-muted-foreground flex flex-row gap-2">
  //       <Badge variant={"secondary"}><CheckIcon /> Answered: {row.original.answered}</Badge>
  //       <Badge variant={"secondary"}>
  //         <CircleHelp />
  //         Unanswered: {row.original.unanswered}
  //       </Badge>
  //     </div>
  //   ),
  // },
  {
    accessorKey: "submittedAt",
    header: ({ column }) => (
      <SortableHeader column={column} title="Submitted" />
    ),
    cell: ({ row }) => {
      const submittedAt = row.getValue("submittedAt") as string | null;
      const startedAt = row.original.startedAt as string | null;
      const status = row.original.status;

      if (status === "in-progress" && !submittedAt) {
        return (
          <div className="flex flex-col">
            <p className="text-amber-500 animate-pulse font-medium text-xs">
              In progress
            </p>
            <p className="text-xs text-muted-foreground">
              Started {dayjs(startedAt).fromNow()}
            </p>
          </div>
        );
      }

      if (status === "test-ended") {
        return (
          <div className="flex flex-col">
            <p className="text-red-500 font-medium text-xs">Time&apos;s up</p>
            <p className="text-xs text-muted-foreground">
              Started {dayjs(startedAt).fromNow()}
            </p>
          </div>
        );
      }

      return submittedAt ? (
        <div className="">
          <p className="font-medium text-xs">
            {dayjs(submittedAt).format("DD MMM YYYY HH:mm")}
          </p>
          <p className="text-xs text-muted-foreground">
            Submitted {dayjs(submittedAt).fromNow()}
          </p>
        </div>
      ) : (
        <div className="text-end text-muted-foreground">Not submitted</div>
      );
    },
  },
];
