import DialogDeleteQuestion from "@/components/shared/dialog/dialog-delete-question";
import QuestionTypeSelection from "@/components/shared/question-type-selection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUpdateBetweenQuestionMutation } from "@/query/organization/question/use-update-between-question.mutation";
import { Question } from "@evaly/backend/types/question";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2, Loader2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CardQuestion = ({
  className,
  hideOptions = false,
  data,
  onClickEdit,
  onChangeOrder,
  onDeleteSuccess,
  previousQuestionId,
  nextQuestionId,
}: {
  className?: string;
  hideOptions?: boolean;
  data?: Question;
  previousQuestionId?: string;
  nextQuestionId?: string;
  onClickEdit?: () => void;
  onChangeOrder?: (questions: { questionId: string; order: number }[]) => void;
  onDeleteSuccess?: () => void;
}) => {
  const [isMoving, setIsMoving] = useState<"up" | "down">();
  const {
    mutateAsync: updateBetweenQuestion,
    isPending: isPendingUpdateBetweenQuestion,
  } = useUpdateBetweenQuestionMutation();

  const handleMove = async (direction: "up" | "down") => {
    if (!data) return;
    const currentId = data.id;
    setIsMoving(direction);

    // For moving up, we swap with the previous question
    // For moving down, we swap with the next question
    // The index of the question is not important, we just need to swap the order of the questions based on the order-key of the questions
    let questions: { questionId: string; order: number }[] = [];

    if (direction === "up") {
      questions = [
        {
          questionId: currentId,
          order: data.order - 1,
        },
        {
          questionId: previousQuestionId as string,
          order: data.order,
        },
      ];
    } else {
      questions = [
        {
          questionId: currentId,
          order: data.order + 1,
        },
        {
          questionId: nextQuestionId as string,
          order: data.order,
        },
      ];
    }

    // We already checked for undefined IDs above, so we can safely assert these are strings
    await updateBetweenQuestion({
      questions,
    })
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      })
      .then(() => {
        setIsMoving(undefined);
        onChangeOrder?.(questions);
      });
  };

  if (!data) return null;

  return (
    <Card
      className={cn(
        "transition-all hover:border-foreground/50 cursor-pointer",
        className
      )}
      onClick={onClickEdit}
    >
      <CardHeader className="border-b py-3 flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3">
          <Button variant={"secondary"} size={"xs"}>
            #
            Question {data.order}
          </Button>
          {data.pointValue ? (
            <Button variant={"secondary"} size={"xs"}>
              Point: {data.pointValue}
            </Button>
          ) : null}
          <QuestionTypeSelection value={data.type} />
        </div>
        <div className="flex flex-row h-5 justify-end items-center">
          {previousQuestionId ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleMove("up");
              }}
              size={"icon-xs"}
              variant={"ghost"}
              disabled={isPendingUpdateBetweenQuestion && isMoving === "up"}
            >
              {isMoving === "up" ? (
                <Loader2 className="text-muted-foreground" />
              ) : (
                <ArrowUp className="text-muted-foreground" />
              )}
            </Button>
          ) : null}

          {nextQuestionId ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleMove("down");
              }}
              size={"icon-xs"}
              variant={"ghost"}
              disabled={
                (isPendingUpdateBetweenQuestion && isMoving === "down") ||
                !nextQuestionId
              }
            >
              {isMoving === "down" ? (
                <Loader2 className="text-muted-foreground" />
              ) : (
                <ArrowDown className="text-muted-foreground" />
              )}
            </Button>
          ) : null}

          <DialogDeleteQuestion
            className="ml-2"
            questionId={data.id}
            onSuccess={() => {
              onDeleteSuccess?.();
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="custom-prose max-w-full max-h-[220px] h-max overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html:
              !data.question || data.question === "<p></p>"
                ? "<p class='text-muted-foreground italic'>No question content. Click to edit.</p>"
                : data.question,
          }}
        />
        {!hideOptions ? (
          <div className="flex flex-col gap-4 text-sm mt-2">
            {data.options?.map((option, i) => (
              <div
                key={option.id}
                className="flex flex-row flex-wrap items-start gap-3"
              >
                <Button
                  size={"icon-sm"}
                  variant={option.isCorrect ? "success" : "secondary"}
                >
                  {option.isCorrect ? (
                    <CheckCircle2 />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </Button>
                <span
                  className={cn(
                    "flex-1 mt-1",
                    option.isCorrect ? "text-foreground" : ""
                  )}
                >
                  {option.text || "Option " + (i + 1)}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default CardQuestion;
