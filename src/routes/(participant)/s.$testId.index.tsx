import { createFileRoute } from "@tanstack/react-router";
import NavbarLobby from "./-components/navbar.lobby";
import { api } from "@convex/_generated/api";
import type { DataModel, Id } from "@convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { NotFound } from "@/components/pages/not-found";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, CheckIcon, FileText, Inbox } from "lucide-react";
import { testTypeFormatter } from "@/lib/test-type-formatter";
import { useQuery } from "convex/react";
import LoadingScreen from "@/components/shared/loading-screen";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(participant)/s/$testId/")({
  component: RouteComponent,
  async loader(ctx) {
    return await ctx.context.queryClient.ensureQueryData(
      convexQuery(api.participant.test.getById, {
        id: ctx.params.testId as Id<"test">,
      })
    );
  },
  head(ctx) {
    return {
      meta: [
        {
          title: ctx.loaderData?.title + " - Evaly",
          description: ctx.loaderData?.description,
        },
      ],
    };
  },
});

function RouteComponent() {
  const { testId } = Route.useParams();
  const { data: test } = useSuspenseQuery(
    convexQuery(api.participant.test.getById, {
      id: testId,
    })
  );

  if (test === undefined) {
    return <LoadingScreen />;
  }

  if (test === null) {
    return <NotFound />;
  }

  return (
    <>
      <NavbarLobby />
      <div className="pb-20 mt-[5vh] md:mt-[10vh] container max-w-2xl">
        <h1 className="text-xl font-semibold mb-4">{test.title}</h1>

        <QuickInfo test={test} />
        <TestSections test={test} />
        <h1 className="mt-8 font-semibold">Description</h1>
        <div
          className="whitespace-pre-line mt-2"
          dangerouslySetInnerHTML={{ __html: test.description || "" }}
        />
      </div>
    </>
  );
}

const QuickInfo = ({ test }: { test: DataModel["test"]["document"] }) => {
  const testSections = useQuery(api.participant.testSection.getByTestId, {
    testId: test._id,
  });

  return (
    <div className="flex flex-row flex-wrap">
      <div className="flex items-center gap-3 text-sm">
        {test.finishedAt ? (
          <Badge>
            <CheckCircleIcon />
            Test Finished
          </Badge>
        ) : null}
        <Badge variant={"secondary"}>{testTypeFormatter(test.type)}</Badge>
        {testSections && testSections?.length === 1 ? (
          <Badge variant={"secondary"}>
            <Inbox className="h-4 w-4 text-muted-foreground" />
            <span>{testSections.length} Sections</span>
          </Badge>
        ) : null}
        <Badge variant={"secondary"}>
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>
            {testSections?.reduce((acc, curr) => acc + curr.numOfQuestions, 0)}{" "}
            Questions
          </span>
        </Badge>
      </div>
    </div>
  );
};

const TestSections = ({ test }: { test: DataModel["test"]["document"] }) => {
  const testSections = useQuery(api.participant.testSection.getByTestId, {
    testId: test._id,
  });

  const attempt = {
    completedAt: undefined,
  };

  if (testSections?.length === 0) {
    return (
      <div className="mt-8">
        <h1 className="font-semibold">Sections</h1>
        <p className="text-sm text-muted-foreground">
          No sections found for this test.
        </p>
      </div>
    );
  }

  if (testSections?.length === 1) {
    return (
      <Button variant={"default"} className="w-max mt-4 px-4" rounded>
        Start Test
      </Button>
    );
  }

  return (
    <>
      <h1 className="mt-8 font-semibold">Sections</h1>
      <Card className="mt-3 divide-y">
        {testSections?.map((section) => {
          // const attempt = getAttemptBySectionId(section.id);
          return (
            <div
              key={section._id}
              className="px-6 py-3 hover:border-solid flex flex-row items-center hover:bg-secondary transition"
            >
              <div className="flex flex-row items-center gap-2 flex-1">
                <h1 className="font-medium">
                  {section.order}. {section.title || `Section ${section.order}`}
                </h1>
                <Badge variant={"outline"}>
                  {section.numOfQuestions} Question
                  {section.numOfQuestions <= 1 ? "" : "s"}
                </Badge>
              </div>
              <div>
                {attempt?.completedAt ? (
                  <Badge variant="success">
                    <CheckIcon /> Completed
                  </Badge>
                ) : test.finishedAt ? (
                  <Badge variant="outline">Test Ended</Badge>
                ) : (
                  <Button
                    onClick={() => {
                      // mutateStartTest({
                      //   testId: testId as string,
                      //   testSectionId: section.id,
                      // });
                    }}
                    disabled={!!test.finishedAt}
                    variant={"outline"}
                    size={"sm"}
                    className="px-3"
                  >
                    Start
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </Card>
    </>
  );
};
