import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useSearch } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebounce } from "@uidotdev/usehooks";
import { useQuery } from "convex/react";
import { Loader2, SearchIcon, Square } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";

const SectionProgress = ({ className }: { className?: string }) => {
  const [searchInput, setSearchInput] = useState("");
  const searchInputDebounce = useDebounce(searchInput, 300);

  const { testId } = useSearch({
    from: "/(organizer)/app/tests/details",
  });

  const testSections = useQuery(api.organizer.testSection.getByTestId, {
    testId: testId as Id<"test">,
  });

  const progress = useQuery(api.organizer.testResult.getProgress, {
    testId: testId as Id<"test">,
  });

  const parentRef = useRef(null);

  const progressFiltered = useMemo(() => {
    const filtered =
      progress && Array.isArray(progress)
        ? progress.filter((item) => {
            if (!searchInputDebounce) return true;
            const name = item.participant?.name || "";
            return name
              .toLowerCase()
              .includes(searchInputDebounce.toLowerCase());
          })
        : [];
    return filtered;
  }, [progress, searchInputDebounce]);

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: progressFiltered.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 28,
    overscan: 20,
  });

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Progress</CardTitle>
        <div className="flex flex-row flex-wrap gap-2 justify-end w-full pr-4">
          <Badge variant={"ghost"} className="px-0">
            <Square className="fill-emerald-500 stroke-emerald-500" />
            Correct
          </Badge>

          <Badge variant={"ghost"} className="px-0">
            <Square className="fill-rose-500 stroke-rose-500" />
            Incorrect
          </Badge>

          <Badge variant={"ghost"} className="px-0">
            <Square className="fill-secondary stroke-secondary" />
            Skipped
          </Badge>
        </div>
        <div className="w-[200px] relative flex flex-row items-center">
          <SearchIcon className="absolute left-2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Find someone"
            className="pl-7 w-md"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </CardHeader>
      {progress === undefined || testSections === undefined ? (
        <div className="px-6">
          <Loader2 className="animate-spin" />
        </div>
      ) : progress?.length && testSections.length ? (
        <CardContent className="pt-0">
          <div ref={parentRef} className="h-[200px] overflow-auto rounded-md">
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
              <table>
                <thead>
                  <tr>
                    <th className="min-w-40 max-w-40 sticky left-0 bg-background p-0 text-sm text-start font-medium text-muted-foreground pb-2">
                      Name
                    </th>
                    {testSections.map((testSection) => (
                      <React.Fragment key={"th-" + testSection._id}>
                        <th className="text-sm truncate px-2 font-medium text-muted-foreground pb-2"></th>
                        {testSection.questions.map((question) => (
                          <th
                            key={`th-${question._id}`}
                            className="max-w-7 min-w-7 text-center text-sm font-medium text-muted-foreground pb-2"
                          >
                            {question.order}
                          </th>
                        ))}
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rowVirtualizer.getVirtualItems().map((virtualItem, i) => {
                    const item = progressFiltered[virtualItem.index];
                    const participant = item.participant;
                    return (
                      <tr
                        key={virtualItem.key}
                        className="group"
                        style={{
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start - i * virtualItem.size}px)`,
                        }}
                      >
                        <td className="min-w-40 max-w-40 sticky left-0 bg-background p-0 truncate">
                          {participant?.name}
                        </td>
                        {testSections.map((testSection) => {
                          const attempt = item.results[testSection._id];
                          return (
                            <React.Fragment key={"th-" + testSection._id}>
                              <th className="text-sm truncate px-2 font-medium text-transparent group-hover:text-muted-foreground "></th>
                              {testSection.questions.map((question) => {
                                const participantAnswer =
                                  attempt?.[question._id];

                                const haveOptions =
                                  question.options?.length || 0;

                                let status:
                                  | "correct"
                                  | "incorrect"
                                  | "need-verify"
                                  | "skipped" = "skipped";

                                if (!haveOptions) {
                                  const isCorrect = participantAnswer.isCorrect;
                                  status =
                                    isCorrect === undefined
                                      ? "need-verify"
                                      : isCorrect === true
                                        ? "correct"
                                        : "incorrect";
                                } else {
                                  const correctOptions =
                                    question.options
                                      ?.filter((e) => e.isCorrect)
                                      .map((e) => e.id) ?? [];
                                  const participantOptionsAnswers =
                                    participantAnswer?.answerOptions ?? [];

                                  // Compare arrays: both must have the same length and same elements (order doesn't matter)
                                  const isCorrect =
                                    correctOptions.length ===
                                      participantOptionsAnswers.length &&
                                    correctOptions.every((opt) =>
                                      participantOptionsAnswers.includes(opt)
                                    ) &&
                                    participantOptionsAnswers.every((opt) =>
                                      correctOptions.includes(opt)
                                    );

                                  status =
                                    participantOptionsAnswers.length === 0
                                      ? "skipped"
                                      : isCorrect
                                        ? "correct"
                                        : "incorrect";
                                }

                                return (
                                  <td
                                    key={`td-${question._id}`}
                                    className={cn("size-5 min-w-5 p-[1px]")}
                                  >
                                    <div
                                      className={cn(
                                        "rounded-[4px] w-full select-none h-full font-semibold text-xs flex items-center justify-center",
                                        status === "correct"
                                          ? "bg-emerald-500  text-emerald-500 group-hover:text-emerald-800"
                                          : "",
                                        status === "skipped"
                                          ? "bg-secondary text-secondary group-hover:text-muted-foreground"
                                          : "",
                                        status === "incorrect"
                                          ? "bg-rose-500 text-rose-500 group-hover:text-rose-300"
                                          : ""
                                      )}
                                    >
                                      {question.order}
                                    </div>
                                  </td>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      ) : progress?.length === 0 ? (
        <div className="px-6">
          <p className="bg-muted px-3 py-2 rounded-lg text-muted-foreground">
            No participant progress yet. Share this test to get started!
          </p>
        </div>
      ) : null}
    </Card>
  );
};

export default SectionProgress;
