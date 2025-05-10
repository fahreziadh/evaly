"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

const DialogDeleteTest = ({
  className,
  testId,
}: {
  className?: string;
  testId: Id<"test">;
}) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("TestDialogs");
  const tCommon = useTranslations("Common");
  const deleteTest = useMutation(api.organizer.test.deleteTest);

  const onDeleteTest = async () => {
    try {
      deleteTest({ testId });
      toast.success(tCommon("deleteSuccess"));
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : tCommon("genericError")
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={"icon-xs"}
          variant={"ghost"}
          className={cn(className)}
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
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t("deleteTestTitle")}</DialogTitle>
          <DialogDescription>{t("deleteTestDescription")}</DialogDescription>
        </DialogHeader>
        {/* <CardSession data={} /> */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>{tCommon("backButton")}</Button>
          </DialogClose>
          <Button variant={"destructive"} onClick={onDeleteTest}>
            {tCommon("deleteButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteTest;
