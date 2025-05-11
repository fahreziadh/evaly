import DialogDeleteQuestion from "@/components/shared/dialog/dialog-delete-question";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { questionTypes } from "@/constants/question-type";
import { cn } from "@/lib/utils";
import { DataModel } from "convex/_generated/dataModel";
import { ArrowDown, ArrowUp, CheckIcon, MousePointerClick } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Questions");
  const tTestDetail = useTranslations("TestDetail");

  const selectedType =
    data?.type && questionTypes[data.type]
      ? questionTypes[data.type]
      : questionTypes["multiple-choice"];

  if (!data) return null;

  return (
    <Card
      className={cn(
        "transition-all rounded-none border-transparent cursor-pointer duration-100 group bg-transparent",
        data.order === 1 ? "mt-6" : "",
        className
      )}
      onClick={onClickEdit}
    >
      <CardHeader className="flex flex-row justify-between items-center p-0">
        <div className="flex flex-row gap-4">
          <Badge variant={"secondary"}>
            {t("questionNumber", { number: data.order })}
          </Badge>
          {data.pointValue ? (
            <Badge variant={"secondary"}>
              {t("pointValue", { number: data.pointValue })}
            </Badge>
          ) : null}
          <Badge variant={"secondary"}>
            {selectedType.icon && <selectedType.icon size={12} />}
            {tTestDetail(selectedType.value)}
          </Badge>
        </div>
        {!previewOnly ? (
          <div className="flex-row h-5 justify-end items-center invisible group-hover:visible flex">
            <Button
              className="hidden group-hover:flex mr-2"
              size={"xs"}
              variant={"secondary"}
            >
              <MousePointerClick className="size-4" />
              {t("clickToEdit")}
            </Button>

            {previousQuestionId ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp?.();
                }}
                size={"icon-xs"}
                variant={"ghost"}
              >
                <ArrowUp className="text-muted-foreground" />
              </Button>
            ) : null}

            {nextQuestionId ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown?.();
                }}
                size={"icon-xs"}
                variant={"ghost"}
              >
                <ArrowDown className="text-muted-foreground" />
              </Button>
            ) : null}

            <DialogDeleteQuestion
              className="ml-2"
              questionId={data._id}
              onSuccess={() => {
                onDeleteSuccess?.();
              }}
            />
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <div
          className="custom-prose max-w-full max-h-[220px] h-max line-clamp-6"
          dangerouslySetInnerHTML={{
            __html:
              !data.question || data.question === "<p></p>"
                ? ` <p class='text-muted-foreground italic'>${t("noQuestionContent")}. ${t("clickToEdit")}.</p>`
                : data.question,
          }}
        />
        {!hideOptions ? (
          <div className="flex flex-col gap-y-3 gap-x-10 text-sm mt-4 mb-2">
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
                    "prose prose-sm lg:prose-base dark:prose-invert prose-neutral max-w-full",
                    option.isCorrect ? "text-emerald-600 font-medium" : "text-muted-foreground"
                  )}
                  dangerouslySetInnerHTML={{
                    __html: `${String.fromCharCode(65 + i).toLowerCase()}. ${option.text || t("option", { number: i + 1 })}`,
                  }}
                />
                {option.isCorrect ? <CheckIcon className="size-4 mt-1" /> : null}
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default CardQuestion;
