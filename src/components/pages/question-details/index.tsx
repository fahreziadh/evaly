"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Loader2,
  PlusIcon, Trash2,
  XIcon
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Reorder, useDragControls } from "motion/react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DataModel, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Editor } from "@/components/shared/editor/editor";
import { question } from "@convex/schemas/question";
import QuestionTypeSelection from "@/components/shared/question-type-selection";
import { getDefaultOptions } from "@/lib/get-default-options";
import { useNavigate, useSearch } from "@tanstack/react-router";

dayjs.extend(relativeTime);

const MAX_QUESTION_LENGTH = 3000;
const MIN_QUESTION_LENGTH = 10;

const EditQuestion = () => {
  const navigate = useNavigate();
  const { questionId, selectedSectionId, testId } = useSearch({
    from: "/(organizer)/app/questions/details",
  });
  const [questionTextLength, setQuestionTextLength] = useState(0);
  const updateQuestion = useMutation(
    api.organizer.question.update
  ).withOptimisticUpdate((localStore, args) => {
    const question = localStore.getQuery(api.organizer.question.getById, {
      id: args.id,
    });

    if (!question) return;

    localStore.setQuery(
      api.organizer.question.getById,
      {
        id: args.id,
      },
      {
        ...question,
        ...args.data,
      }
    );
  });

  const question = useQuery(api.organizer.question.getById, {
    id: questionId as Id<"question">,
  });

  const isLoading = question === undefined;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { isDirty, errors },
  } = useForm<DataModel["question"]["document"]>({
    reValidateMode: "onChange",
  });

  const { allowMultipleAnswers, options } = watch();
  const isOptionsType =
    question?.type === "multiple-choice" || question?.type === "yes-or-no";

  // Validate options
  const validateOptions = () => {
    if (!isOptionsType || !options) return true;

    // Check if there are at least 2 options for multiple-choice questions
    if (options.length < 2) {
      return "At least 2 options are required";
    }

    // Check if at least one option is marked as correct
    const correctOptions = options.filter((option) => option.isCorrect);
    if (correctOptions.length === 0) {
      return "At least one option must be marked as correct";
    }

    // For multiple-choice with allowMultipleAnswers, not all options should be correct
    if (allowMultipleAnswers && correctOptions.length === options.length) {
      return "Not all options can be marked as correct in multiple-choice questions";
    }

    // Check if all options have text content
    const emptyOptions = options.filter(
      (option) => !option.text || option.text.trim() === ""
    );
    if (emptyOptions.length > 0) {
      return "All options must have text content";
    }

    // Check for duplicate option values
    const optionTexts = options.map((option) =>
      option.text?.trim().toLowerCase()
    );
    const uniqueOptionTexts = new Set(optionTexts.filter((text) => text)); // Filter out empty strings
    if (uniqueOptionTexts.size < optionTexts.filter((text) => text).length) {
      return "All options must have unique values";
    }

    return true;
  };

  useEffect(() => {
    if (question) {
      reset(question);
    }
  }, [question, reset]);

  const onSubmit = async (data: DataModel["question"]["document"]) => {
    if (!question?._id) return;

    // Validate options
    if (isOptionsType && data.options) {
      // Check if there are at least 2 options for multiple-choice questions
      if (data.options.length < 2) {
        alert("At least 2 options are required");
        return;
      }

      // Check if at least one option is marked as correct
      const correctOptions = data.options.filter((option) => option.isCorrect);
      if (correctOptions.length === 0) {
        alert("At least one option must be marked as correct");
        return;
      }

      // For multiple-choice with allowMultipleAnswers, not all options should be correct
      if (
        data.allowMultipleAnswers &&
        correctOptions.length === data.options.length
      ) {
        alert(
          "Not all options can be marked as correct in multiple-choice questions"
        );
        return;
      }

      // Check if all options have text content
      const emptyOptions = data.options.filter(
        (option) => !option.text || option.text.trim() === ""
      );
      if (emptyOptions.length > 0) {
        alert("All options must have text content");
        return;
      }

      // Check for duplicate option values
      const optionTexts = data.options.map((option) =>
        option.text?.trim().toLowerCase()
      );
      const uniqueOptionTexts = new Set(optionTexts.filter((text) => text)); // Filter out empty strings
      if (uniqueOptionTexts.size < optionTexts.filter((text) => text).length) {
        alert("All options must have unique values");
        return;
      }
    }

    await updateQuestion({
      id: question._id,
      data: {
        question: data.question,
        options: data.options,
      },
    });
  };

  const onBack = () => {
    if (testId) {
      navigate({
        to: "/app/tests/details",
        search: {
          tabs: "questions",
          testId,
          selectedSection: selectedSectionId,
        },
      });
    } else {
      navigate({
        to: "/app/questions",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-row w-full justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <Button variant={"secondary"} size={"icon-sm"} onClick={onBack}>
            <ArrowLeft />
          </Button>
          <h1 className="">Question {question?.order}</h1>
        </div>
        <div className="flex flex-row gap-3">
          {isDirty && (
            <Button
              disabled={!isDirty}
              variant={"outline"}
              onClick={() => {
                reset();
              }}
            >
              Reset
            </Button>
          )}
          {isDirty && testId && selectedSectionId ? (
            <Button
              disabled={!isDirty}
              variant={isDirty ? "outline-solid" : "secondary"}
              onClick={handleSubmit((data) => {
                onSubmit(data).then(() => {
                  onBack()
                });
              })}
            >
              Save & Back
            </Button>
          ) : null}
          <Button
            disabled={!isDirty}
            variant={isDirty ? "default" : "secondary"}
            onClick={handleSubmit((data) => {
              onSubmit(data);
            })}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-row gap-2 justify-between items-center mt-8">
        <div className="flex flex-row gap-2 items-center mb-3">
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <QuestionTypeSelection
                value={field.value || undefined}
                onValueChange={(value) => {
                  field.onChange(value);

                  // if the question type is changed, then reset the options with the default options of the new question type
                  const defaultOptions = getDefaultOptions(value);
                  if (defaultOptions) {
                    setValue("options", defaultOptions);
                    setValue("allowMultipleAnswers", false);
                    clearErrors();
                  }
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="pointValue"
            rules={{
              validate: (value) => {
                if (typeof value === "number" && (value == 0 || value > 100)) {
                  return "Point value must be between 0 and 100";
                }
                return true;
              },
            }}
            render={({ field }) =>
              typeof field.value === "number" ? (
                <div className="flex flex-row gap-2 items-center relative">
                  <Label className="absolute left-2.5 text-xs text-muted-foreground/80 pt-0.5">
                    Point Value
                  </Label>
                  <Input
                    type="number"
                    className={cn(
                      "w-28 pl-12 h-7",
                      errors.pointValue ? "border-destructive" : ""
                    )}
                    min={0}
                    max={100}
                    placeholder="0"
                    value={field.value === 0 && !field.value ? "" : field.value}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                  <Button
                    variant={"ghost"}
                    size={"icon-xs"}
                    className="absolute right-1"
                    onClick={() => {
                      setValue("pointValue", undefined, {
                        shouldDirty: true,
                      });
                    }}
                  >
                    <XIcon className="size-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    field.onChange(5);
                  }}
                  variant={"secondary"}
                  className="hidden"
                >
                  <PlusIcon />
                  Add Point
                </Button>
              )
            }
          />
          {errors.pointValue && (
            <span className="text-xs text-destructive">
              {errors.pointValue.message}
            </span>
          )}
        </div>
        {question ? (
          <Pagination referenceId={question?.referenceId as Id<"test">} />
        ) : (
          <TextShimmer>Loading...</TextShimmer>
        )}
      </div>

      <div className="pb-4">
        <Controller
          control={control}
          name="question"
          rules={{
            validate: () => {
              if (questionTextLength < MIN_QUESTION_LENGTH) {
                return `Question text must be at least ${MIN_QUESTION_LENGTH} characters`;
              }
              if (questionTextLength > MAX_QUESTION_LENGTH) {
                return `Question text must be less than ${MAX_QUESTION_LENGTH} characters`;
              }
              return true;
            },
          }}
          render={({ field }) => (
            <div className="relative">
              <Editor
                disabled={question === undefined}
                onContentLengthChange={setQuestionTextLength}
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Type your question here..."
                editorClassName={cn(
                  errors.question ? "border-destructive" : ""
                )}
                toolbarClassName={cn(
                  "sticky top-0",
                  errors.question ? "border-destructive" : ""
                )}
              />
              <p className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {questionTextLength} / {MAX_QUESTION_LENGTH}
              </p>
              <span
                className={cn(
                  "text-xs text-muted-foreground mt-2",
                  errors.question ? "text-destructive" : ""
                )}
              >
                {errors.question ? (
                  <span className="ml-2">{errors.question?.message}</span>
                ) : null}
              </span>
            </div>
          )}
        />

        {isOptionsType && !isLoading ? (
          <div className="mt-8 mb-6 flex flex-row items-center gap-2">
            <Label className="text-sm text-muted-foreground">
              Select Correct Answer
            </Label>
            <Separator className="flex-1" />
            {options && options?.length > 2 ? (
              <div className="flex flex-row items-center gap-2">
                <Label className="text-sm text-muted-foreground">
                  Allow Multiple Answers
                </Label>
                <Switch
                  checked={allowMultipleAnswers === true}
                  onCheckedChange={(value) => {
                    if (
                      value === false &&
                      (options?.filter((option) => option.isCorrect).length ||
                        0) > 1
                    ) {
                      setValue(
                        "options",
                        options?.map((option) => ({
                          ...option,
                          isCorrect: false,
                        })),
                        { shouldDirty: true }
                      );
                    }
                    setValue("allowMultipleAnswers", value);
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {isOptionsType && options ? (
          <Controller
            control={control}
            name="options"
            rules={{
              validate: validateOptions,
            }}
            render={({ field }) => (
              <>
                <Options
                  value={field.value || []}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  type={question?.type}
                  allowMultipleAnswers={allowMultipleAnswers === true}
                />
                {errors.options && (
                  <span className="text-xs text-destructive mt-2">
                    {errors.options.message}
                  </span>
                )}
              </>
            )}
          />
        ) : null}
      </div>
    </div>
  );
};

const Options = ({
  value,
  onChange,
  allowMultipleAnswers,
  type,
}: {
  value: DataModel["question"]["document"]["options"];
  onChange: (options: DataModel["question"]["document"]["options"]) => void;
  allowMultipleAnswers: boolean;
  type: DataModel["question"]["document"]["type"];
}) => {
  const onChangeOption = (
    option: NonNullable<DataModel["question"]["document"]["options"]>[number]
  ) => {
    if (!value) return;
    onChange(value.map((item) => (item.id === option.id ? option : item)));
  };

  // Calculate validation states
  const correctOptionsCount =
    value?.filter((option) => option.isCorrect)?.length || 0;
  const hasNoCorrectOption = correctOptionsCount === 0;
  const allOptionsCorrect =
    value && value.length > 0 && correctOptionsCount === value.length;
  const hasEmptyOptions = value?.some(
    (option) => !option.text || option.text.trim() === ""
  );
  const hasTooFewOptions = value && value.length < 2;

  // Check for duplicate options
  const hasDuplicateOptions = (() => {
    if (!value) return false;
    const optionTexts = value
      .map((option) => option.text?.trim().toLowerCase())
      .filter((text) => text);
    const uniqueOptionTexts = new Set(optionTexts);
    return uniqueOptionTexts.size < optionTexts.length;
  })();

  const maxOptions =
    type === "multiple-choice" ? 5 : type === "yes-or-no" ? 2 : 0;

  if (!value) return null;

  return (
    <div className="flex flex-col gap-2">
      <Reorder.Group
        className="flex flex-col gap-2 mt-2 text-sm"
        onReorder={(newOrder) => {
          onChange(newOrder);
        }}
        values={value}
      >
        {value.map((option, i) => {
          // Check if this option is a duplicate
          const isDuplicate = !!(
            option.text &&
            option.text.trim() !== "" &&
            value.some(
              (o) =>
                o.id !== option.id &&
                o.text &&
                o.text.trim().toLowerCase() === option.text.trim().toLowerCase()
            )
          );

          return (
            <OptionItem
              option={option}
              index={i}
              onChange={(option) => {
                onChangeOption(option);
              }}
              onClickCorrect={() => {
                if (!allowMultipleAnswers) {
                  onChange(
                    value.map((item) => ({
                      ...item,
                      isCorrect:
                        item.id === option.id ? !option.isCorrect : false,
                    }))
                  );
                } else {
                  // For multiple-choice, toggle the current option's correctness without affecting others
                  onChange(
                    value.map((item) =>
                      item.id === option.id
                        ? { ...item, isCorrect: !item.isCorrect }
                        : item
                    )
                  );
                }
              }}
              key={option.id}
              onDelete={() => {
                onChange(value.filter((item) => item.id !== option.id));
              }}
              isDuplicate={isDuplicate}
            />
          );
        })}
      </Reorder.Group>

      {/* Add Option Button */}
      {value && value.length < maxOptions && (
        <div className="mt-4 mx-auto">
          <Button
            variant="outline"
            className="w-max border-dashed"
            onClick={() => {
              // Determine max options based on question type

              // Only add if we haven't reached the maximum
              if (value.length < maxOptions) {
                const newOption = {
                  id: nanoid(5),
                  text: "",
                  isCorrect: false,
                };
                onChange([...value, newOption]);
              }
            }}
          >
            Add Option
          </Button>
        </div>
      )}

      {/* Validation warnings */}
      {hasNoCorrectOption && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          At least one option must be marked as correct
        </div>
      )}
      {allowMultipleAnswers && allOptionsCorrect && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          Not all options should be marked as correct in multiple-choice
          questions
        </div>
      )}
      {hasEmptyOptions && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          All options must have text content
        </div>
      )}
      {hasTooFewOptions && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          At least two options are required
        </div>
      )}
      {hasDuplicateOptions && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          All options must have unique values
        </div>
      )}
    </div>
  );
};

const OptionItem = ({
  option,
  index,
  onChange,
  onClickCorrect,
  onDelete,
  isDuplicate,
}: {
  option: NonNullable<DataModel["question"]["document"]["options"]>[number];
  index: number;
  onChange: (
    options: NonNullable<DataModel["question"]["document"]["options"]>[number]
  ) => void;
  onClickCorrect?: () => void;
  onDelete: () => void;
  isDuplicate?: boolean;
}) => {
  const control = useDragControls();
  const isEmptyOption = !option.text || option.text.trim() === "";

  return (
    <Reorder.Item
      value={option}
      className="flex flex-row items-center gap-1"
      dragListener={false}
      dragControls={control}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={"icon"}
            className="select-none mr-2"
            variant={option.isCorrect ? "success" : "secondary"}
            onClick={onClickCorrect}
          >
            {option.isCorrect ? (
              <CheckCircle2 className="size-5" />
            ) : (
              String.fromCharCode(65 + index)
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {option.isCorrect
            ? "This is the correct answer"
            : "Click to mark as correct answer"}
        </TooltipContent>
      </Tooltip>
      <div className="flex-1 flex flex-row items-center">
        <Input
          placeholder={`Option ${index + 1}`}
          className={cn(
            "bg-card h-9",
            isEmptyOption ? "border-destructive" : "",
            isDuplicate ? "border-amber-500 bg-warning" : ""
          )}
          value={option.text}
          onChange={(e) => {
            onChange({ ...option, text: e.target.value });
          }}
        />
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onPointerDown={(e) => control.start(e)}
              variant={"ghost"}
              size={"icon"}
            >
              <GripVertical className="text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Drag to reorder options</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"ghost"} size={"icon"} onClick={onDelete}>
              <Trash2 className="text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete option</TooltipContent>
        </Tooltip>
      </div>
    </Reorder.Item>
  );
};

export default EditQuestion;

const Pagination = ({ referenceId }: { referenceId: string }) => {
  const { questionId, selectedSectionId, testId } = useSearch({
    from: "/(organizer)/app/questions/details",
  });
  const navigate = useNavigate();

  const questions = useQuery(api.organizer.question.getAllByReferenceId, {
    referenceId,
  });
  const currentQuestion = useMemo(() => {
    return questions?.find((question) => question._id === questionId);
  }, [questions, questionId]);

  return (
    <div className="flex flex-row items-center gap-2">
      <Button
        variant={"outline"}
        size={"icon"}
        disabled={currentQuestion?.order === 1}
        onClick={() => {
          if (!currentQuestion) return;
          const previousQuestion = questions?.[currentQuestion?.order - 2];
          if (previousQuestion) {
            navigate({
              to: "/app/questions/details",
              search: {
                questionId: previousQuestion._id,
                selectedSectionId,
                testId,
              },
            });
          }
        }}
      >
        <ChevronLeft />
      </Button>
      {question && currentQuestion ? (
        <div className="gap-0.5 flex flex-row items-center text-base select-none">
          {currentQuestion?.order}
          <span className="text-sm">/</span>
          {questions?.length}
        </div>
      ) : (
        <Loader2 className="size-4 animate-spin" />
      )}
      <Button
        variant={"outline"}
        size={"icon"}
        disabled={currentQuestion?.order === questions?.length}
        onClick={() => {
          if (!currentQuestion) return;
          const nextQuestion = questions?.[currentQuestion?.order];
          if (nextQuestion) {
            navigate({
              to: "/app/questions/details",
              search: {
                questionId: nextQuestion._id,
                selectedSectionId,
                testId,
              },
            });
          }
        }}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
