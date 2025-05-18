import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import {
  CircleUserRoundIcon,
  ClockIcon,
  FileInput,
  FolderCheckIcon,
  Loader2,
  SearchIcon,
  Square,
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@uidotdev/usehooks";

const Results = () => {
  return (
    <div className="grid grid-cols-6 gap-4">
      <SectionStats className="col-span-6" />
      <SectionProgress className="col-span-4" />
      <SectionLeaderBoards className="col-span-2" />
    </div>
  );
};

const SectionStats = ({ className }: { className?: string }) => {
  const { testId } = useSearch({
    from: "/(organizer)/app/tests/details",
  });

  const presence = useQuery(api.participant.testPresence.list, {
    testId: testId as Id<"test">,
  });

  const progress = useQuery(api.organizer.testResult.getProgress, {
    testId: testId as Id<"test">,
  });

  const { totalSubmissions, averageFinished, completitionRate } = useMemo(() => {
    if (!progress)
      return {
        totalSubmissions: 0,
        averageFinished: { h: 0, m: 0, s: 0 },
        completitionRate: 0,
      };
    //Total Submissions
    const totalSubmissions = progress.filter(
      (e) => e.isFinished === true
    ).length;

    // AverageTime
    const totalTime = progress.reduce(
      (acc, curr) => acc + curr.totalFinishedInSecond,
      0
    );
    const averageTotalTime = totalTime / progress.length;

    const h = Math.floor(averageTotalTime / 3600) || 0
    const m = Math.floor((averageTotalTime % 3600) / 60) || 0
    const s = Math.floor(averageTotalTime % 60) || 0 
    const averageFinished = {h,m,s}

    // Completition Rate
    const completitionRate =  Math.floor((totalSubmissions / progress.length) * 100) || 0

    return { totalSubmissions, averageFinished ,completitionRate };
  }, [progress]);

  return (
    <div className={cn("grid grid-cols-4 gap-3", className)}>
      <Card className="p-4 flex flex-row justify-between">
        <div>
          <h1 className="font-medium text-sm">Working in progress</h1>
          <NumberFlow
            value={presence?.length || 0}
            className="text-3xl font-bold"
          />
        </div>
        <CircleUserRoundIcon className="size-5 stroke-rose-400" />
      </Card>
      <Card className="p-4 flex flex-row justify-between">
        <div>
          <h1 className="font-medium text-sm">Submission</h1>
          <NumberFlow value={totalSubmissions} className="text-3xl font-bold" />
        </div>
        <FileInput className="size-5 stroke-blue-500" />
      </Card>
      <Card className="p-4 flex flex-row justify-between">
        <div>
          <h1 className="font-medium text-sm">Average Time</h1>
          <NumberFlowGroup>
            <div
              style={{
                fontVariantNumeric: "tabular-nums",
              }}
              className="text-3xl font-bold flex item-baseline gap-2"
            >
              {averageFinished.h > 0 ? (
                <NumberFlow
                  trend={-1}
                  value={averageFinished.h}
                  format={{ minimumIntegerDigits: 2 }}
                  suffix="h"
                />
              ) : null}

              <NumberFlow
                trend={-1}
                value={averageFinished.m}
                digits={{ 1: { max: 5 } }}
                suffix="m"
                format={{ minimumIntegerDigits: 2 }}
              />
              {averageFinished.m === 0 ? (
                <NumberFlow
                  trend={-1}
                  value={averageFinished.s}
                  digits={{ 1: { max: 5 } }}
                  suffix="s"
                  format={{ minimumIntegerDigits: 2 }}
                />
              ) : null}
            </div>
          </NumberFlowGroup>
        </div>
        <ClockIcon className="size-5 stroke-emerald-500" />
      </Card>
      <Card className="p-4 flex flex-row justify-between">
        <div className="flex-1">
          <h1 className="font-medium text-sm">Completetion Rate</h1>
          <div className="flex flex-row items-center gap-4">
            <NumberFlow value={completitionRate} className="text-3xl font-bold" suffix="%" />
            <Progress value={completitionRate} className="mt-2 flex-1" />
          </div>
        </div>
        <FolderCheckIcon className="size-5 stroke-indigo-500" />
      </Card>
    </div>
  );
};

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
                        <td className="min-w-40 max-w-40 sticky left-0 bg-background group-hover:bg-muted transition-colors p-0 truncate">
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
                                        "rounded-[4px] w-full select-none h-full font-semibold text-xs flex items-center justify-center transition-colors",
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

const SectionLeaderBoards = ({ className }: { className?: string }) => {
  const parentRef = useRef(null);

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: 30000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 20,
  });

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Leaderboards</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div ref={parentRef} className="h-[200px] overflow-auto rounded-md">
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
            <div className="flex flex-row items-center">
              <span className="w-8"></span>
              <span className="flex-1 text-sm text-muted-foreground">Name</span>
              <span className="text-sm text-muted-foreground">Pts</span>
            </div>
            {rowVirtualizer.getVirtualItems().map((virtualItem, i) => (
              <div
                key={virtualItem.key}
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start - i * virtualItem.size}px)`,
                }}
                className="flex flex-row items-center"
              >
                <span className="w-8">{virtualItem.index + 1}.</span>
                <Avatar className="size-6">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <span className="flex-1 ml-2">Fahrezi Adha</span>
                <span>{93}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Results;
