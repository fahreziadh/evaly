import CardQuestion from "@/components/shared/card-question";
import DialogAddQuestion from "@/components/shared/dialog-add-question";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { PlusIcon } from "lucide-react";
import { Reorder } from "motion/react";
import { toast } from "sonner";

const Questions = ({
  selectedSectionId,
  testId,
}: {
  selectedSectionId: Id<"testSection">;
  testId: Id<"test">;
}) => {
  const navigate = useNavigate();
  const changeOrder = useMutation(
    api.organizer.question.changeOrder
  ).withOptimisticUpdate((localStore, args) => {
    const currentQuestions = localStore.getQuery(
      api.organizer.question.getAllByReferenceId,
      { referenceId: selectedSectionId as string }
    );
    if (currentQuestions) {
      const optimisticQuestions = currentQuestions;
      for (const question of args.questionIds) {
        const index = optimisticQuestions.findIndex(
          (q) => q._id === question.questionId
        );
        if (index !== -1) {
          optimisticQuestions[index].order = question.order;
        }
      }

      localStore.setQuery(
        api.organizer.question.getAllByReferenceId,
        {
          referenceId: selectedSectionId as string,
        },
        optimisticQuestions.sort((a, b) => a.order - b.order)
      );
    }
  });

  const dataQuestions = useQuery(api.organizer.question.getAllByReferenceId, {
    referenceId: selectedSectionId,
  });

  const handleChangeOrder = (
    questionIds: { questionId: Id<"question">; order: number }[]
  ) => {
    changeOrder({
      questionIds,
    });
  };

  const goToDetailQuestion = (questionId: Id<"question">) => {
    navigate({
      to: "/app/questions/details",
      search: {
        questionId,
        selectedSectionId,
        testId,
      },
    });
  };

  if (dataQuestions === undefined) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-44 w-full " />
        <Skeleton className="h-44 w-full " />
        <Skeleton className="h-44 w-full " />
        <Skeleton className="h-44 w-full " />
        <Skeleton className="h-44 w-full " />
      </div>
    );
  }

  if (!dataQuestions.length) {
    return (
      <div className="flex flex-col p-6 gap-4 bg-card rounded-md border border-dashed">
        <h1>No question found</h1>
        <DialogAddQuestion
          testId={testId as string}
          referenceId={selectedSectionId as string}
          order={(dataQuestions?.length || 0) + 1}
          onSuccessCreateQuestion={(questionId) => {
            toast.success("Questions added successfully");
            goToDetailQuestion(questionId);
          }}
        />
      </div>
    );
  }

  return (
    <Reorder.Group
      onReorder={() => {}}
      values={dataQuestions}
      as="div"
      className={cn("w-full")}
    >
      {dataQuestions.map((data, index) => {
        return (
          <Reorder.Item
            value={data}
            as="div"
            key={data._id}
            data-index={index}
            dragListener={false}
          >
            <CardQuestion
              onClickEdit={() => {
                goToDetailQuestion(data._id);
              }}
              data={data}
              previousQuestionId={dataQuestions[index - 1]?._id}
              nextQuestionId={dataQuestions[index + 1]?._id}
              onMoveUp={() => {
                const previousQuestion = dataQuestions[index - 1];
                if (previousQuestion) {
                  handleChangeOrder([
                    {
                      questionId: previousQuestion._id,
                      order: previousQuestion.order + 1,
                    },
                    {
                      questionId: data._id,
                      order: previousQuestion.order,
                    },
                  ]);
                }
              }}
              onMoveDown={() => {
                const nextQuestion = dataQuestions[index + 1];
                if (nextQuestion) {
                  handleChangeOrder([
                    {
                      questionId: nextQuestion._id,
                      order: nextQuestion.order - 1,
                    },
                    { questionId: data._id, order: nextQuestion.order },
                  ]);
                }
              }}
            />
            <div
              className={cn(
                "h-8 flex items-center justify-center relative group/separator",
                index === dataQuestions.length - 1 ? "mb-4" : ""
              )}
            >
              <DialogAddQuestion
                testId={testId as string}
                referenceId={selectedSectionId as string}
                order={data.order + 1}
                triggerButton={
                  <Button
                    size={"xxs"}
                    variant={"outline"}
                    className={cn(
                      "absolute opacity-50 lg:opacity-0 lg:group-hover/separator:opacity-100",
                      index === dataQuestions.length - 1 ? "lg:opacity-100" : ""
                    )}
                  >
                    <PlusIcon /> Add Question
                  </Button>
                }
                onSuccessCreateQuestion={(questionId) => {
                  goToDetailQuestion(questionId);
                }}
              />
              <div className="h-auto border-b border-border border-dashed w-full group-hover/separator:border-foreground/20" />
            </div>
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
};

export default Questions;
