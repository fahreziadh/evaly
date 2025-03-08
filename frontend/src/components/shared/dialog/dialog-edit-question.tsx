import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  GripVertical,
  Loader2,
  Trash2,
  PlusCircle,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Drawer,
  DrawerHeader,
  DrawerNavbar,
  DrawerTitle,
} from "@/components/ui/drawer";
import { DrawerContent } from "@/components/ui/drawer";
import { DrawerClose } from "@/components/ui/drawer";
import { DrawerFooter } from "@/components/ui/drawer";
import QuestionTypeSelection from "@/components/shared/question-type-selection";
import { Editor } from "@/components/shared/editor/editor";
import { Separator } from "@/components/ui/separator";
import { Question, UpdateQuestion } from "@evaly/backend/types/question";
import { useUpdateQuestionMutation } from "@/query/organization/question/use-update-question.mutation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Reorder, useDragControls } from "motion/react";
import { Input } from "@/components/ui/input";
import { getDefaultOptions } from "@/lib/get-default-options";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";

dayjs.extend(relativeTime);

const MAX_QUESTION_LENGTH = 3000;
const MIN_QUESTION_LENGTH = 10;

const DialogEditQuestion = ({
  defaultValue,
  onSuccess,
  onClose,
}: {
  defaultValue?: Question | null;
  onSuccess?: (question: Question) => void;
  onClose?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [questionTextLength, setQuestionTextLength] = useState(0);

  const { mutateAsync: updateQuestion, isPending: isPendingUpdateQuestion } =
    useUpdateQuestionMutation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { isDirty, errors },
  } = useForm<UpdateQuestion>({
    reValidateMode: "onChange",
  });

  const type = watch("type");
  const updatedAt = watch("updatedAt");
  const isOptionsType = type === "multiple-choice" || type === "yes-or-no";
  const allowMultipleAnswers = watch("allowMultipleAnswers");
  const options = watch("options");

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
    if (defaultValue) {
      reset(defaultValue);
      setOpen(true);
    } else {
      setOpen(false);
      onClose?.();
    }
  }, [defaultValue, reset, onClose]);

  const onSubmit = async (data: UpdateQuestion, saveAndClose?: boolean) => {
    if (!defaultValue?.id) return;

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

    const updatedQuestion = await updateQuestion(data);

    if (updatedQuestion) {
      onSuccess?.(updatedQuestion);
    }

    if (saveAndClose) {
      closeDialog(!updatedQuestion); // if the question is not updated, then the dialog is not dirty
    }
  };

  const closeDialog = (isDirty?: boolean) => {
    if (isDirty) {
      const confirmed = window.confirm(
        "Are you sure you want to close? Any unsaved changes will be lost."
      );
      if (!confirmed) return;
      setOpen(false);
      onClose?.();
    } else {
      setOpen(false);
      onClose?.();
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(e) => {
        if (!e) {
          closeDialog(isDirty);
        } else {
          setOpen(true);
        }
      }}
      handleOnly
    >
      <DrawerContent className="h-dvh">
        <DrawerNavbar
          onBack={() => closeDialog(isDirty)}
          title={`Edit Question #${defaultValue?.order}`}
        />

        <div className="flex flex-col overflow-y-auto">
          <DrawerHeader className="pt-10 container max-w-4xl px-6">
            <DrawerTitle className="flex justify-between items-center">
              <div className="flex flex-row gap-2 items-center">
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <QuestionTypeSelection
                      size={"default"}
                      variant={"outline-solid"}
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
                      if (
                        typeof value === "number" &&
                        (value == 0 || value > 100)
                      ) {
                        return "Point value must be between 0 and 100";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) =>
                    typeof field.value === "number" ? (
                      <div className="flex flex-row gap-2 items-center relative">
                        <Label className="absolute left-2.5 text-xs text-muted-foreground/80 pt-0.5">
                          Point:
                        </Label>
                        <Input
                          type="number"
                          className={cn(
                            "w-28 pl-12",
                            errors.pointValue ? "border-destructive" : ""
                          )}
                          min={0}
                          max={100}
                          placeholder="0"
                          value={
                            field.value === 0 && !field.value ? "" : field.value
                          }
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value);
                            field.onChange(value);
                          }}
                        />
                        <Button
                          variant={"ghost"}
                          size={"icon-xxs"}
                          className="absolute right-1"
                          onClick={() => {
                            setValue("pointValue", null, { shouldDirty: true });
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
                        size={"sm"}
                      >
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
              <div className="flex flex-row gap-2 text-muted-foreground font-normal text-sm">
                Last updated: {dayjs(updatedAt).fromNow()}
              </div>
            </DrawerTitle>
          </DrawerHeader>

          <div className="container max-w-4xl pb-10">
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
                <>
                  <Editor
                    onContentLengthChange={setQuestionTextLength}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Type your question here..."
                    editorClassName={cn(
                      errors.question
                        ? "border-destructive"
                        : ""
                    )}
                    toolbarClassName={cn(
                      "sticky top-0",
                      errors.question
                        ? "border-destructive"
                        : ""
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs text-muted-foreground mt-2",
                      errors.question ? "text-destructive" : ""
                    )}
                  >
                    <span>
                      {questionTextLength} / {MAX_QUESTION_LENGTH}
                    </span>
                    {errors.question ? (
                      <span className="ml-2">- {errors.question?.message}</span>
                    ) : null}
                  </span>
                </>
              )}
            />

            {isOptionsType ? (
              <div className="mt-8 mb-6 flex flex-row items-center gap-2">
                <Label className="text-sm text-muted-foreground">
                  Select the correct answer
                </Label>
                <Separator className="flex-1" />
                {options && options?.length > 2 ? (
                  <div className="flex flex-row items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      Allow multiple answers
                    </Label>
                    <Switch
                      checked={allowMultipleAnswers === true}
                      onCheckedChange={(value) => {
                        if (
                          value === false &&
                          (options?.filter((option) => option.isCorrect)
                            .length || 0) > 1
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

            {isOptionsType ? (
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

        <DrawerFooter className="border-t px-0">
          <div className="flex flex-row justify-between w-full z-50 container max-w-4xl">
            <div className="flex flex-row gap-2">
              <DrawerClose asChild>
                <Button variant={"secondary"}>Back</Button>
              </DrawerClose>
              {isDirty ? (
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    if (defaultValue) {
                      reset(defaultValue);
                    }
                  }}
                >
                  Reset
                </Button>
              ) : null}
            </div>
            <div className="flex flex-row gap-2">
              {isDirty ? (
                <Button
                  variant={"ghost"}
                  onClick={handleSubmit((data) => onSubmit(data, true))}
                  disabled={isPendingUpdateQuestion || !isDirty}
                >
                  {isPendingUpdateQuestion ? (
                    <Loader2 className="animate-spin" />
                  ) : null}
                  Save & Close
                </Button>
              ) : null}
              <Button
                onClick={handleSubmit((data) => onSubmit(data, false))}
                disabled={isPendingUpdateQuestion || !isDirty}
              >
                {isPendingUpdateQuestion ? (
                  <Loader2 className="animate-spin" />
                ) : null}
                Save
              </Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const Options = ({
  value,
  onChange,
  allowMultipleAnswers,
}: {
  value: UpdateQuestion["options"];
  onChange: (options: UpdateQuestion["options"]) => void;
  allowMultipleAnswers: boolean;
}) => {
  const onChangeOption = (
    option: NonNullable<UpdateQuestion["options"]>[number]
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

  if (!value) return null;
  return (
    <div className="flex flex-col gap-2">
      <Reorder.Group
        className="flex flex-col gap-4 mt-2 text-sm"
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
      {value && (
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Determine max options based on question type
              const maxOptions =
                value[0]?.text === "Yes" && value[1]?.text === "No" ? 2 : 5;

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
            disabled={
              // Disable if we've reached the maximum options
              // For yes-or-no questions, max is 2
              // For other option-based questions, max is 5
              (value[0]?.text === "Yes" &&
                value[1]?.text === "No" &&
                value.length >= 2) ||
              value.length >= 5
            }
          >
            {value.length >=
            (value[0]?.text === "Yes" && value[1]?.text === "No" ? 2 : 5) ? (
              <span>Maximum options reached</span>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Option
              </>
            )}
          </Button>
        </div>
      )}

      {/* Validation warnings */}
      {hasNoCorrectOption && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          At least one option must be marked as correct.
        </div>
      )}
      {allowMultipleAnswers && allOptionsCorrect && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          Not all options should be marked as correct in multiple-choice
          questions.
        </div>
      )}
      {hasEmptyOptions && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          All options must have text content.
        </div>
      )}
      {hasTooFewOptions && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          At least 2 options are required.
        </div>
      )}
      {hasDuplicateOptions && (
        <div className="text-sm text-warning-foreground bg-warning p-2 rounded-md mb-2">
          All options must have unique values.
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
  option: NonNullable<UpdateQuestion["options"]>[number];
  index: number;
  onChange: (options: NonNullable<UpdateQuestion["options"]>[number]) => void;
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
      <Button
        size={"icon"}
        className="select-none size-10 mr-2"
        variant={option.isCorrect ? "success" : "secondary"}
        onClick={onClickCorrect}
      >
        {option.isCorrect ? (
          <CheckCircle2 className="size-5" />
        ) : (
          String.fromCharCode(65 + index)
        )}
      </Button>
      <div className="flex-1 flex flex-row items-center">
        <Input
          placeholder={`Type options ${index + 1}`}
          className={cn(
            "h-10",
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
        <Button
          onPointerDown={(e) => control.start(e)}
          variant={"ghost"}
          size={"icon-sm"}
        >
          <GripVertical className="text-muted-foreground" />
        </Button>
        <Button variant={"ghost"} size={"icon-sm"} onClick={onDelete}>
          <Trash2 className="text-muted-foreground" />
        </Button>
      </div>
    </Reorder.Item>
  );
};

export default DialogEditQuestion;
