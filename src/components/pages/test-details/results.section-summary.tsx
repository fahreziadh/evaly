"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "convex-helpers/react/cache";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type TestSection = Awaited<
  typeof api.organizer.testSection.getByTestId._returnType
>[number];

function ResultsSectionSummary() {
  const { testId } = useSearch({
    from: "/(organizer)/app/tests/details",
  });
  const testSections = useQuery(api.organizer.testSection.getByTestId, {
    testId: testId as Id<"test">,
  });
  // const summary = useQuery(api.organizer.testResult.getSummary, {
  //   testId: testId as Id<"test">,
  //   testSectionId: selectedSection as Id<"testSection">
  // })

  if (!testSections) {
    return <TextShimmer>Loading sections...</TextShimmer>;
  }

  return (
    <div className="flex flex-col gap-4">
      {testSections.map((e) => (
        <Section
          testSection={e}
          key={e._id}
          showSectionDetail={testSections.length > 1}
        />
      ))}
    </div>
  );
}

function Section({
  testSection,
  showSectionDetail = false,
}: {
  testSection: TestSection;
  showSectionDetail?: boolean;
}) {
  const [show, setShow] = useState(true);
  const summary = useQuery(api.organizer.testResult.getSummary, {
    testId: testSection.testId,
    testSectionId: testSection._id,
  });

  if (summary === undefined) {
    return <TextShimmer>Loading summary...</TextShimmer>;
  }

  return (
    <div className={cn(showSectionDetail ? "border py-2 px-4 rounded-xl" : "")}>
      {showSectionDetail ? (
        <div className="flex flex-row items-center justify-between">
          <Badge variant={"default"}>
            {testSection.title || `Section ${testSection.order}`}
          </Badge>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setShow((prev) => !prev)}
          >
            {!show ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      ) : null}

      <div className={cn("flex flex-col gap-14 border rounded-lg p-4", show ? "" : "hidden")}>
        {testSection.questions.map((q) => {
          const totalResponses = Object.values(
            summary?.[q._id].optionsAnswer ?? {}
          ).reduce((a, b) => a + b, 0);
          return (
            <div key={q._id} className="w-full">
              <div
                className="custom-prose line-clamp-3 max-w-2xl"
                dangerouslySetInnerHTML={{ __html: "q.question" }}
              />
              <Label>{totalResponses} Response</Label>
              {q.options?.length ? (
                <div className="space-y-2">
                  {q.options.map((o, i) => {
                    const totalResponse =
                      summary?.[q._id].optionsAnswer[o.id] ?? 0;
                    const totalPercentageResponse =
                      totalResponses > 0
                        ? Math.round((totalResponse / totalResponses) * 100)
                        : 0;
                    return (
                      <div
                        key={o.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full"
                      >
                        <div
                          className={cn(
                            "border overflow-clip p-1 flex-1 sm:max-w-md flex flex-row items-center relative gap-2 rounded-md"
                          )}
                        >
                          <motion.div
                            className={cn(
                              "absolute left-0 h-full bg-foreground/10 -z-10"
                            )}
                            initial={{
                              width: 0,
                            }}
                            animate={{ width: `${totalPercentageResponse}%` }}
                            transition={{
                              duration: 0.1,
                            }}
                          />

                          <Badge
                            variant={"outline"}
                            className="capitalize font-semibold"
                          >
                            {String.fromCharCode(98 + i)}
                          </Badge>

                          <div
                            className={cn(
                              "custom-prose max-w-full line-clamp-1 flex-1"
                            )}
                            dangerouslySetInnerHTML={{ __html: o.text }}
                          />

                          <Label>{totalPercentageResponse}%</Label>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Label>{totalResponse} Response</Label>
                          {o.isCorrect ? (
                            <CheckCircle2 className="size-4 text-muted-foreground" />
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultsSectionSummary;
