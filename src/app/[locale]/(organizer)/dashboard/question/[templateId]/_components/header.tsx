import BackButton from "@/components/shared/back-button";
import { Button } from "@/components/ui/button";
import { QuestionTemplate } from "@/types/question";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import TagsInput from "@/components/ui/tags-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import DialogDeleteQuestionTemplate from "@/components/shared/dialog/dialog-delete-question-template";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { trpc } from "@/trpc/trpc.client";
import { useProgressRouter } from "@/components/shared/progress-bar";
const Header = ({ templateId }: { templateId: string }) => {
  const { data: questionTemplate, isLoading: isLoadingQuestionTemplate } =
    trpc.organization.questionTemplate.getById.useQuery({
      id: templateId as string,
    });

  const router = useProgressRouter();

  const {
    mutate: updateQuestionTemplate,
    isPending: isUpdatingQuestionTemplate,
  } = trpc.organization.questionTemplate.update.useMutation({
    onError(error) {
      toast.error(error.message || "Failed to update question template");
    },
    onSuccess(data) {
      toast.success("Question template updated successfully");
      reset(data);
    },
  });

  const {
    formState: { isDirty },
    control,
    handleSubmit,
    reset,
  } = useForm<QuestionTemplate>();

  useEffect(() => {
    if (questionTemplate) {
      reset(questionTemplate);
    }
  }, [questionTemplate, reset]);

  const onSubmit = (data: QuestionTemplate) => {
    updateQuestionTemplate({ id: templateId, data });
  };

  return (
    <form
      className="flex flex-col gap-4 md:flex-row justify-between items-start"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-row gap-2 items-center">
        <BackButton href={`/dashboard/question`} />
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <input
              value={field.value || ""}
              onChange={field.onChange}
              disabled={isLoadingQuestionTemplate || isUpdatingQuestionTemplate}
              className="outline-none font-medium max-w-xl w-full md:w-xl"
              placeholder="Add question template title"
            />
          )}
        />
        {isDirty ? (
          <Button
            disabled={
              !isDirty ||
              isLoadingQuestionTemplate ||
              isUpdatingQuestionTemplate
            }
            className="w-max"
            type="submit"
            size={"sm"}
          >
            {isUpdatingQuestionTemplate ? "Saving..." : "Save"}
          </Button>
        ) : null}
      </div>
      <div className="flex flex-row gap-2 justify-end w-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"ghost"} size={"icon-sm"}>
              <InfoIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            You can use this template on a test detail page
          </TooltipContent>
        </Tooltip>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="gap-1" size={"sm"}>
                  {field.value && field.value.length ? (
                    <span>Tags: </span>
                  ) : (
                    <span>Add tag</span>
                  )}
                  {field.value?.length > 0 ? (
                    field.value?.length <= 2 ? (
                      field.value?.map((e) => (
                        <Badge key={e} variant="outline">
                          {e}
                        </Badge>
                      ))
                    ) : (
                      <>
                        <Badge variant="outline">{field.value[0]}</Badge>
                        <Badge variant="outline">{field.value[1]}</Badge>
                        <Badge variant="outline">
                          +{field.value.length - 2}
                        </Badge>
                      </>
                    )
                  ) : null}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <TagsInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Add a tag"
                  className="max-w-md"
                />
                <Label className="text-xs text-muted-foreground">
                  Press enter to add a tag
                </Label>
              </PopoverContent>
            </Popover>
          )}
        />

        <DialogDeleteQuestionTemplate
          templateId={templateId}
          onSuccess={() => {
            router.push("/dashboard/question");
          }}
        />
      </div>
    </form>
  );
};

export default Header;
