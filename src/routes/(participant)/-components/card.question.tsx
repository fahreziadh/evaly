import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import type { DataModel, Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";

const CardQuestion = ({
  question,
  answers,
  attemptId,
}: {
  question: DataModel["question"]["document"];
  answers?: DataModel["testAttemptAnswer"]["document"];
  attemptId: Id<"testAttempt">;
}) => {
  const setAnswer = useMutation(
    api.participant.testAttemptAnswer.setAnswer
  ).withOptimisticUpdate((localStore, args) => {
    const existingAnswers = localStore.getQuery(
      api.participant.testAttemptAnswer.getByAttemptId,
      {
        testAttemptId: attemptId as Id<"testAttempt">,
      }
    );

    if (existingAnswers) {
      localStore.setQuery(
        api.participant.testAttemptAnswer.getByAttemptId,
        {
          testAttemptId: attemptId as Id<"testAttempt">,
        },
        existingAnswers.map((answer) => {
          if (answer.questionId === question._id) {
            return { ...answer, ...args };
          }
          return answer;
        })
      );
    }
  });
  const handleSubmitAnswer = ({
    answerOptions,
    answerText,
  }: {
    answerOptions?: string[];
    answerText?: string;
  }) => {
    setAnswer({
      testAttemptId: attemptId as Id<"testAttempt">,
      questionId: question._id,
      answerOptions,
      answerText,
    });
  };
  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <span className="text-sm text-muted-foreground mb-1">
          Question {question.order}
        </span>
        <span className=" text-sm text-muted-foreground flex flex-row gap-2 items-center">
          {/* {isPendingAnswer ? (
          <>
            <Loader2 className="size-3 animate-spin" /> Saving...
          </>
        ) : null} */}
        </span>
      </div>
      <div
        className="custom-prose max-w-none lg:prose-lg"
        dangerouslySetInnerHTML={{
          __html: question.question ?? "No question found",
        }}
      />

      {/* Option-based question */}
      {question.type === "multiple-choice" || question.type === "yes-or-no" ? (
        <div className="flex flex-col mt-4 gap-3">
          {question.options?.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSubmitAnswer({ answerOptions: [option.id] })}
              className={cn(
                "max-w-full w-max h-auto border rounded-md py-1 px-3 text-start cursor-pointer transition-all",
                answers?.answerOptions?.includes(option.id)
                  ? "border-primary bg-secondary "
                  : "border-border hover:border-primary/50 active:border-primary active:bg-primary/5"
              )}
            >
              {/* {option.id === targetOptionId && isPendingAnswer ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                String.fromCharCode(65 + i)
              )} */}
              <div
                className={cn(
                  "custom-prose prose-sm max-w-full text-ellipsis",
                 
                )}
                dangerouslySetInnerHTML={{
                  __html: option.text ?? "No option found",
                }}
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Text-based question */}
      {question.type === "text-field" ? (
        <div className="flex flex-col gap-3 mt-8">
          <Textarea
            // {...register("answerText")}
            className="resize-none lg:text-base p-4"
            placeholder="Type your answer here..."
          />
          {/* {isDirty && answerText !== "" && (
            <Button
              variant="default"
              size="sm"
              className="w-max"
              onClick={handleSubmit(handleSubmitAnswer)}
            >
              Save
            </Button>
          )} */}
        </div>
      ) : null}
    </div>
  );
};

export default CardQuestion;
