import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { questionTypes } from "@/lib/question-type";
import { cn } from "@/lib/utils";
import type { DataModel } from "@convex/_generated/dataModel";
import {
  ArrowDown,
  ArrowUp,
  CheckIcon,
  SquareDashedMousePointer,
} from "lucide-react";
import DialogDeleteQuestion from "./dialog-delete-question";

const CardQuestion = ({
  className,
  hideOptions = false,
  data,
  onClickEdit,
  onMoveUp,
  onMoveDown,
  onDeleteSuccess,
  previousQuestionId,
  nextQuestionId,
  previewOnly,
}: {
  className?: string;
  hideOptions?: boolean;
  data?: DataModel["question"]["document"];
  previousQuestionId?: string;
  nextQuestionId?: string;
  onClickEdit?: () => void;
  onDeleteSuccess?: () => void;
  previewOnly?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) => {
  const selectedType =
    data?.type && questionTypes[data.type]
      ? questionTypes[data.type]
      : questionTypes["multiple-choice"];

  if (!data) return null;

  return (
    <Card
      className={cn("cursor-pointer group px-6 py-4 border-dashed", className)}
      onClick={onClickEdit}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-4">
          <Badge variant={"secondary"}>{`Question ${data.order}`}</Badge>
          {data.pointValue ? (
            <Badge variant={"secondary"}>{`${data.pointValue} points`}</Badge>
          ) : null}
          <Badge variant={"secondary"}>
            {selectedType.icon && <selectedType.icon size={12} />}
            {selectedType.label}
          </Badge>
        </div>
        {!previewOnly ? (
          <div className="flex-row h-5 justify-end items-center flex gap-2">
            <Button
              className="hidden group-hover:flex"
              size={"xs"}
              variant={"secondary"}
            >
              <SquareDashedMousePointer className="size-4" />
              Click to edit
            </Button>

            {previousQuestionId ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onMoveUp?.();
                }}
                size={"icon-xs"}
                variant={"secondary"}
              >
                <ArrowUp className="text-muted-foreground" />
              </Button>
            ) : null}

            {nextQuestionId ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onMoveDown?.();
                }}
                size={"icon-xs"}
                variant={"secondary"}
              >
                <ArrowDown className="text-muted-foreground" />
              </Button>
            ) : null}

            <DialogDeleteQuestion
              questionId={data._id}
              onSuccess={() => {
                onDeleteSuccess?.();
              }}
            />
          </div>
        ) : null}
      </div>
      <div className="mt-3">
        <div
          className="custom-prose max-w-full max-h-[220px] h-max line-clamp-6"
          dangerouslySetInnerHTML={{
            __html:
              !data.question || data.question === "<p></p>"
                ? ` <p class='text-muted-foreground italic'>No question content. Click to edit.</p>`
                : data.question,
          }}
        />
        {!hideOptions ? (
          <div className="flex flex-col gap-y-1 gap-x-10 mt-2">
            {data.options?.map((option, i) => (
              <div
                key={option.id || `option-${i}`}
                className={cn(
                  "flex flex-row flex-wrap items-start gap-2",
                  option.isCorrect
                    ? "text-emerald-600 font-medium"
                    : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "prose prose-sm dark:prose-invert prose-neutral max-w-full",
                    option.isCorrect
                      ? "text-emerald-600 font-medium"
                      : "text-muted-foreground"
                  )}
                  dangerouslySetInnerHTML={{
                    __html: `${String.fromCharCode(65 + i).toLowerCase()}. ${option.text || "Option " + (i + 1)}`,
                  }}
                />
                {option.isCorrect ? (
                  <CheckIcon className="size-4 mt-1" />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default CardQuestion;
