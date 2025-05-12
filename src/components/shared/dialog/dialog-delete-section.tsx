import { useSelectedSection } from "@/app/[locale]/(organizer)/dashboard/tests/_hooks/use-selected-section";
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
import { TooltipMessage } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const DialogDeleteSection = ({
  className,
  sectionId,
  isLastSection = false,
  testId,
}: {
  className?: string;
  sectionId: string;
  isLastSection?: boolean;
  testId: Id<"test">;
}) => {
  const t = useTranslations("TestDetail");
  const tCommon = useTranslations("Common");
  const [, setSelectedSection] = useSelectedSection();

  const [open, setOpen] = useState(false);
  const deleteSection = useMutation(
    api.organizer.testSection.remove
  ).withOptimisticUpdate((localStore, args) => {
    const section = localStore.getQuery(api.organizer.testSection.getByTestId, {
      testId,
    });
    if (!section) return;
    localStore.setQuery(
      api.organizer.testSection.getByTestId,
      {
        testId,
      },
      section.filter((q) => q._id !== args.sectionId)
    );
  });

  const onHandleDelete = async () => {
    await deleteSection({ sectionId: sectionId as Id<"testSection"> });
    setSelectedSection(null);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <TooltipMessage message="Delete section">
            <Button
              size={"icon"}
              variant={"ghost"}
              className={cn(className)}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              <Trash2Icon />
            </Button>
          </TooltipMessage>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deleteSectionTitle")}</DialogTitle>
          <DialogDescription>{t("deleteSectionDescription")}</DialogDescription>
        </DialogHeader>
        {isLastSection && (
          <span className="text-sm text-muted-foreground bg-secondary p-2 rounded-md">
            {t("deleteSectionLastSection")}
          </span>
        )}
        <DialogFooter>
          <Button variant={"secondary"} onClick={() => setOpen(false)}>
            {tCommon("backButton")}
          </Button>
          <Button
            variant={"destructive"}
            disabled={isLastSection}
            onClick={onHandleDelete}
          >
            {tCommon("deleteButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteSection;
