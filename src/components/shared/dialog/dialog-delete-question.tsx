import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "convex/_generated/dataModel";

const DialogDeleteQuestion = ({
  className,
  disabled = false,
  questionId,
  onSuccess,
}: {
  className?: string;
  disabled?: boolean;
  questionId: string;
  onSuccess: () => void;
}) => {
  const t = useTranslations("Questions");
  const tCommon = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const deleteQuestion = useMutation(api.organizer.question.deleteById);


  const onDeleteQuestion = async () => {
    toast.promise(deleteQuestion({ id: questionId as Id<"question"> }), {
      loading: "Deleting question...",
      success: "Question deleted successfully",
      error: "Failed to delete question",
    });
    onSuccess();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          size={"icon-xxs"}
          variant={"ghost"}
          className={cn("text-muted-foreground", className)}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Trash2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t("deleteQuestionTitle")}</DialogTitle>
          <DialogDescription>
            {t("deleteQuestionDescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"secondary"}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            {tCommon("backButton")}
          </Button>
          <Button
            variant={"destructive"}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteQuestion();
            }}
          >
            {tCommon("deleteButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteQuestion;
