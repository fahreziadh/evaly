import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import CardQuestion from "@/components/shared/card/card-question";
import { cn } from "@/lib/utils";
import { Reorder } from "motion/react";
import DialogAddQuestion from "@/components/shared/dialog/dialog-add-question";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Link, useProgressRouter } from "@/components/shared/progress-bar";

const Questions = ({ selectedSection }: { selectedSection: string }) => {
  const router = useProgressRouter();
  const testId = useSearchParams().get("testId") as Id<"test">;
  const tCommon = useTranslations("Common");
  const t = useTranslations("TestDetail");
  const changeOrder = useMutation(
    api.organizer.question.changeOrder
  ).withOptimisticUpdate((localStore, args) => {
    const currentQuestions = localStore.getQuery(
      api.organizer.question.getAllByReferenceId,
      { referenceId: selectedSection as string }
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
          referenceId: selectedSection as string,
        },
        optimisticQuestions.sort((a, b) => a.order - b.order)
      );
    }
  });

  const dataQuestions = useQuery(api.organizer.question.getAllByReferenceId, {
    referenceId: selectedSection as string,
  });

  const handleChangeOrder = (
    questionIds: { questionId: Id<"question">; order: number }[]
  ) => {
    changeOrder({
      questionIds,
    });
  };

  const goToDetailQuestion = (questionId: Id<"question">) => {
    router.push(`/dashboard/question/detail?questionId=${questionId}&testId=${testId}`);
  };

  if (dataQuestions === undefined) {
    return <TextShimmer>Loading questions...</TextShimmer>;
  }

  return (
    <>
      {dataQuestions?.length ? (
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
                <Link href={`/dashboard/question/detail?questionId=${data._id}&testId=${testId}`}>
                  <CardQuestion
                    data={data}
                    className={cn(index === 0 ? "mt-0" : "")}
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
                </Link>
                <div
                  className={cn(
                    "h-12 flex items-center justify-center relative group/separator",
                    index === dataQuestions.length - 1 ? "mb-4" : ""
                  )}
                >
                  <DialogAddQuestion
                    testId={testId as string}
                    referenceId={selectedSection as string}
                    order={data.order + 1}
                    triggerButton={
                      <Button
                        size={"xxs"}
                        variant={"outline"}
                        className={cn(
                          "absolute opacity-50 lg:opacity-0 lg:group-hover/separator:opacity-100",
                          index === dataQuestions.length - 1
                            ? "lg:opacity-100"
                            : ""
                        )}
                      >
                        <PlusIcon /> {t("addQuestion")}
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
      ) : (
        <div className="flex flex-col p-6 gap-4 bg-card border rounded-md">
          <h1>{t("noQuestionFound")}</h1>
          <DialogAddQuestion
            testId={testId as string}
            referenceId={selectedSection as string}
            order={(dataQuestions?.length || 0) + 1}
            onSuccessCreateQuestion={(questionId) => {
              toast.success(tCommon("questionsAddedSuccessfully"));
              goToDetailQuestion(questionId);
            }}
          />
        </div>
      )}
    </>
  );
};

export default Questions;
