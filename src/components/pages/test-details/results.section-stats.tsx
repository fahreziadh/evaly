import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { Progress } from "@radix-ui/react-progress";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import {
  CircleUserRoundIcon,
  ClockIcon,
  FileInput,
  FolderCheckIcon,
} from "lucide-react";
import { useMemo } from "react";

const SectionStats = ({ className }: { className?: string }) => {
  const { testId } = useSearch({
    from: "/(organizer)/app/tests/details",
  });

  const presence = useQuery(api.participant.testPresence.list, {
    testId: testId as Id<"test">,
  });

  const results = useQuery(api.organizer.testResult.getProgress, {
    testId: testId as Id<"test">,
  });

  const { totalSubmissions, averageFinished, completitionRate } =
    useMemo(() => {
      if (!results?.progress)
        return {
          totalSubmissions: 0,
          averageFinished: { h: 0, m: 0, s: 0 },
          completitionRate: 0,
        };
      //Total Submissions
      const totalSubmissions = results.progress.filter(
        (e) => e.isFinished === true
      ).length;

      // AverageTime
      const totalTime = results.progress.reduce(
        (acc, curr) => acc + curr.totalFinishedInSecond,
        0
      );
      const averageTotalTime = totalTime / results.progress.length;

      const h = Math.floor(averageTotalTime / 3600) || 0;
      const m = Math.floor((averageTotalTime % 3600) / 60) || 0;
      const s = Math.floor(averageTotalTime % 60) || 0;
      const averageFinished = { h, m, s };

      // Completition Rate
      const completitionRate =
        Math.floor((totalSubmissions / results.progress.length) * 100) || 0;

      return { totalSubmissions, averageFinished, completitionRate };
    }, [results]);

  return (
    <Card className={cn("grid grid-cols-4 gap-3 divide-x divide-dashed", className)}>
      <div className="p-4 flex flex-row justify-between">
        <div>
          <h1 className="font-medium text-sm">Working in progress</h1>
          <NumberFlow
            value={presence?.length || 0}
            className="text-3xl font-bold"
          />
        </div>
        <CircleUserRoundIcon className="size-5 stroke-rose-400" />
      </div>
      <div className="p-4 flex flex-row justify-between">
        <div>
          <h1 className="font-medium text-sm">Submission</h1>
          <NumberFlow value={totalSubmissions} className="text-3xl font-bold" />
        </div>
        <FileInput className="size-5 stroke-blue-500" />
      </div>
      <div className="p-4 flex flex-row justify-between">
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
      </div>
      <div className="p-4 flex flex-row justify-between">
        <div className="flex-1">
          <h1 className="font-medium text-sm">Completetion Rate</h1>
          <div className="flex flex-row items-center gap-4">
            <NumberFlow
              value={completitionRate}
              className="text-3xl font-bold"
              suffix="%"
            />
            <Progress value={completitionRate} className="mt-2 flex-1" />
          </div>
        </div>
        <FolderCheckIcon className="size-5 stroke-indigo-500" />
      </div>
    </Card>
  );
};

export default SectionStats;
