"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type TestSection = Awaited<
  typeof api.organizer.testSection.getByTestId._returnType
>[number];

function ResultsSectionSummary() {
  const { testId, selectedSection } = useSearch({
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
    <div className="flex flex-col gap-12">
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
  return (
    <div
      className={cn(
        showSectionDetail ? "border p-4 rounded-lg border-dashed" : ""
      )}
    >
      {showSectionDetail ? (
        <div className="flex flex-row items-start justify-between">
          <Badge size={"lg"}>
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

      <div
        className={cn(
          "flex flex-col gap-12 mt-4",
          show ? "" : "hidden"
        )}
      >
        {testSection.questions.map((e) => (
          <div key={e._id} className="w-full">
            <div
              className="custom-prose max-w-full line-clamp-3 max-w-2xl md:prose-lg"
              dangerouslySetInnerHTML={{ __html: e.question }}
            />
            <Label>0 Response</Label>
            {e.options?.length ? (
              <div className="mt-4 space-y-2">
                {e.options.map((e, i) => (
                  <div
                    key={e.id}
                    className="flex flex-row items-center gap-4 w-full"
                  >
                    <div className="border py-1.5 px-2 flex-1 max-w-md flex flex-row items-center relative gap-2 rounded-md">
                      <Badge variant={"outline"}>
                        {String.fromCharCode(98 + i)}
                      </Badge>

                      <div
                        className="custom-prose max-w-full line-clamp-1"
                        dangerouslySetInnerHTML={{ __html: e.text }}
                      />
                    </div>
                    <Label>0 Response</Label>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsSectionSummary;
