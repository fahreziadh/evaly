import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import CardQuestion from "@/components/shared/card/card-question";
import { useEffect, useState } from "react";
import { useSelectedSection } from "../../_hooks/use-selected-section";
import DialogEditQuestion from "@/components/shared/dialog/dialog-edit-question";
import {
  cn,
  insertQuestionsAtCorrectPosition,
  updateQuestionInArray,
} from "@/lib/utils";
import { Reorder } from "motion/react";
import DialogAddQuestion from "@/components/shared/dialog/dialog-add-question";
import { Question } from "@/types/question";
import { toast } from "sonner";
import { notFound, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { trpc } from "@/trpc/trpc.client";
import { TextShimmer } from "@/components/ui/text-shimmer";

const Questions = () => {
  const [selectedSection, setSelectedSection] = useSelectedSection();
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const { id: testId } = useParams();

  const tCommon = useTranslations("Common");
  const t = useTranslations("TestDetail");

  const { data: dataSections, refetch: refetchSections } =
    trpc.organization.testSection.getAll.useQuery(
      {
        testId: testId as string,
      },
      {
        enabled: !!testId,
      }
    );

  const {
    data: dataQuestions,
    isRefetching: isRefetchingQuestions,
    isPending: isPendingQuestions,
  } = trpc.organization.question.getAll.useQuery(
    {
      referenceId: selectedSection as string,
    },
    { enabled: !!selectedSection }
  );

  const {
    error: errorSelectedSection,
    isPending: isPendingSelectedSection,
  } = trpc.organization.testSection.getById.useQuery(
    { id: selectedSection || "" },
    {
      enabled: !!selectedSection,
    }
  );

  const [localQuestions, setLocalQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (dataQuestions) {
      setLocalQuestions(dataQuestions);
    }
  }, [dataQuestions]);

  useEffect(() => {
    if (dataSections && !selectedSection) {
      setSelectedSection(dataSections[0].id);
    }
  }, [dataQuestions, dataSections, selectedSection, setSelectedSection]);

  const onHandleChangeOrder = (
    changedQuestionOrders: {
      questionId: string;
      order: number;
    }[]
  ) => {
    // Update the local questions state to reflect the order changes immediately
    setLocalQuestions((prevQuestions) => {
      // Create a copy of the previous questions
      const updatedQuestions = [...prevQuestions];

      // Update the order of each changed question
      changedQuestionOrders.forEach(({ questionId, order }) => {
        const questionIndex = updatedQuestions.findIndex(
          (q) => q.id === questionId
        );
        if (questionIndex !== -1) {
          updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            order,
          };
        }
      });

      // Sort the questions by their new order
      return updatedQuestions.sort((a, b) => a.order - b.order);
    });
  };

  if (isPendingSelectedSection){
    return <TextShimmer>Loading detail section...</TextShimmer>
  }

  if (isPendingQuestions) {
    return <TextShimmer>Loading questions...</TextShimmer>;
  }

  if (!isPendingSelectedSection && errorSelectedSection) {
    return notFound();
  }

  return (
    <>
      {localQuestions?.length ? (
        <Reorder.Group
          onReorder={() => {}}
          values={localQuestions}
          as="div"
          className={cn("w-full", isRefetchingQuestions ? "animate-pulse" : "")}
        >
          {localQuestions.map((data, index) => {
            return (
              <Reorder.Item
                value={data}
                as="div"
                key={data.id}
                data-index={index}
                dragListener={false}
              >
                <CardQuestion
                  onChangeOrder={onHandleChangeOrder}
                  data={data}
                  onClickEdit={() => setSelectedQuestion(data)}
                  className={cn(
                    index === 0 ? "mt-0" : "",
                    isRefetchingQuestions ? "cursor-progress" : ""
                  )}
                  onDeleteSuccess={() => {
                    refetchSections();
                    const findIndex = localQuestions.findIndex(
                      (q) => q.id === data.id
                    );
                    if (findIndex >= 0) {
                      // Update the order of questions after deletion
                      setLocalQuestions((prev) => {
                        const filtered = prev.filter((q) => q.id !== data.id);
                        return filtered.map((q, index) => ({
                          ...q,
                          order:
                            q.order && data.order && q.order > data.order
                              ? q.order - 1
                              : index + 1,
                        }));
                      });
                    }
                  }}
                  previousQuestionId={localQuestions[index - 1]?.id}
                  nextQuestionId={localQuestions[index + 1]?.id}
                />
                <div
                  className={cn(
                    "h-12 flex items-center justify-center relative group/separator",
                    index === localQuestions.length - 1 ? "mb-4" : ""
                  )}
                >
                  <DialogAddQuestion
                    testId={testId as string}
                    referenceId={selectedSection as string}
                    order={data.order + 1}
                    onSuccessCreateQuestion={(questions) => {
                      setLocalQuestions((prev) =>
                        insertQuestionsAtCorrectPosition(prev, questions)
                      );
                      if (questions.length === 1) {
                        setSelectedQuestion(questions[0]);
                      } else {
                        toast.success(tCommon("questionsAddedSuccessfully"));
                      }
                      refetchSections();
                    }}
                    triggerButton={
                      <Button
                        size={"xxs"}
                        variant={"outline"}
                        className={cn(
                          "absolute opacity-50 lg:opacity-0 lg:group-hover/separator:opacity-100",
                          index === localQuestions.length - 1
                            ? "lg:opacity-100"
                            : ""
                        )}
                      >
                        <PlusIcon /> {t("addQuestion")}
                      </Button>
                    }
                  />
                  <div className="h-auto border-b border-border border-dashed w-full group-hover/separator:border-foreground/20" />
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      ) : (
        <div className="flex flex-col p-6 gap-4 bg-secondary">
          <h1>{t("noQuestionFound")}</h1>
          <DialogAddQuestion
            testId={testId as string}
            referenceId={selectedSection as string}
            order={localQuestions.length + 1}
            onSuccessCreateQuestion={(questions) => {
              setLocalQuestions((prev) =>
                insertQuestionsAtCorrectPosition(prev, questions)
              );
              if (questions.length === 1) {
                setSelectedQuestion(questions[0]);
              } else {
                toast.success(tCommon("questionsAddedSuccessfully"));
              }
              refetchSections();
            }}
          />
        </div>
      )}
      <DialogEditQuestion
        defaultValue={selectedQuestion}
        onSuccess={(question) => {
          setSelectedQuestion(question);
          setLocalQuestions((prev) => updateQuestionInArray(prev, question));
        }}
        onClose={() => {
          setSelectedQuestion(undefined);
        }}
      />
    </>
  );
};

export default Questions;
