import LoadingScreen from "@/components/shared/loading-screen";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import NavbarAttempt from "./-components/navbar.attempt";
import CardQuestion from "./-components/card.question";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { NotFound } from "@/components/pages/not-found";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/(participant)/s/$testId/$attemptId")({
  component: RouteComponent,
  pendingComponent: LoadingScreen,
});

function RouteComponent() {
  const user = useQuery(api.participant.profile.getProfile);

  if (user === undefined) {
    return <LoadingScreen />;
  }

  if (user === null) {
    return notFound();
  }

  return (
    <div className="pb-10">
      <NavbarAttempt user={user} />
      <ListQuestions />
      <FinishTestButton />
    </div>
  );
}

const ListQuestions = () => {
  const { attemptId, testId } = Route.useParams();
  const testAttempt = useQuery(api.participant.testAttempt.getById, {
    id: attemptId as Id<"testAttempt">,
  });

  const answers = useQuery(api.participant.testAttemptAnswer.getByAttemptId, {
    testAttemptId: attemptId as Id<"testAttempt">,
  });

  if (testAttempt === undefined) {
    return <LoadingScreen />;
  }

  if (testAttempt === null) {
    return <NotFound />;
  }

  if (testAttempt.questions.length === 0) {
    return (
      <div className="container mt-12 flex flex-col gap-12 max-w-[1000px] font-medium text-lg">
        No questions found
      </div>
    );
  }

  return (
    <div className="container mt-12 flex flex-col gap-12 max-w-[1000px]">
      {testAttempt.questions.map((question) => {
        return (
          <CardQuestion
            key={question._id}
            question={question}
            attemptId={attemptId as Id<"testAttempt">}
            answers={answers?.find(
              (answer) => answer.questionId === question._id
            )}
            testId={testId as Id<"test">}
          />
        );
      })}
    </div>
  );
};

const FinishTestButton = () => {
  const { attemptId } = Route.useParams();
  const navigate = useNavigate();
  const testAttempt = useQuery(api.participant.testAttempt.getById, {
    id: attemptId as Id<"testAttempt">,
  });

  const answers = useQuery(api.participant.testAttemptAnswer.getByAttemptId, {
    testAttemptId: attemptId as Id<"testAttempt">,
  });

  const finishTest = useMutation(
    api.participant.testAttempt.finish
  ).withOptimisticUpdate((localStore) => {
    const existingTestAttempt = localStore.getQuery(
      api.participant.testAttempt.getById,
      {
        id: attemptId as Id<"testAttempt">,
      }
    );

    if (!existingTestAttempt) {
      return;
    }

    localStore.setQuery(
      api.participant.testAttempt.getById,
      {
        id: attemptId as Id<"testAttempt">,
      },
      {
        ...existingTestAttempt,
        finishedAt: Date.now(),
      }
    );
  });

  const totalQuestions = testAttempt?.questions.length;
  const answeredQuestions = answers?.length;
  const isFinished = testAttempt?.finishedAt !== undefined;

  return (
    <div className="container max-w-[1000px] mt-14 border-dashed flex flex-col gap-2 border border-primary/30 rounded-md bg-background shadow-xl shadow-primary/5 p-4">
      <p className="text-sm text-muted-foreground">
        {totalQuestions === answeredQuestions
          ? "You have answered all the questions"
          : "You have answered " +
            answeredQuestions +
            " out of " +
            totalQuestions +
            " questions"}
      </p>
      {isFinished ? (
        <Button
          variant={"outline"}
          onClick={() =>
            navigate({
              to: "/s/$testId",
              params: { testId: testAttempt?.testId as string },
            })
          }
          className="w-max"
        >
          <ArrowLeftIcon />
          Back to test
        </Button>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-max px-4"
              variant={
                totalQuestions === answeredQuestions ? "default" : "outline"
              }
            >
              Submit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to submit the test?
              </DialogTitle>
              <DialogDescription>
                {totalQuestions === answeredQuestions
                  ? "You have answered all the questions"
                  : "You have answered " +
                    answeredQuestions +
                    " out of " +
                    totalQuestions +
                    " questions"}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button
                onClick={() =>
                  finishTest({ id: attemptId as Id<"testAttempt"> }).finally(
                    () => {
                      navigate({
                        to: "/s/$testId",
                        params: { testId: testAttempt?.testId as string },
                      });
                    }
                  )
                }
              >
                Yes, submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
