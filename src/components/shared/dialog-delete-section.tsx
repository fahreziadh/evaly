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
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

const DialogDeleteSection = ({
  className,
  sectionId,
  isLastSection = false,
  testId,
  onDelete
}: {
  className?: string;
  sectionId: string;
  isLastSection?: boolean;
  testId: Id<"test">;
  onDelete?: () => void;
}) => {
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
    onDelete?.()
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
          <DialogTitle>Delete section</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this section?
          </DialogDescription>
        </DialogHeader>
        {isLastSection && (
          <span className="text-sm text-muted-foreground bg-secondary p-2 rounded-md">
            This is the last section, you cannot delete it.
          </span>
        )}
        <DialogFooter>
          <Button variant={"secondary"} onClick={() => setOpen(false)}>
            Back
          </Button>
          <Button
            variant={"destructive"}
            disabled={isLastSection}
            onClick={onHandleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteSection;
