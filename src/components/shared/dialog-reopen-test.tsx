import type { DataModel, Id } from "@convex/_generated/dataModel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";
import { Copy, Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState } from "react";

export const DialogReopenTest = ({
  dataTest,
  onReopened,
}: {
  dataTest?: DataModel["test"]["document"];
  onReopened: (newTestId: Id<"test">) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const duplicateTest = useMutation(api.organizer.test.duplicateTest);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>
          <Copy />
          Duplicate test
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You are about to duplicate the test.</DialogTitle>
          <DialogDescription>
            This action will create a completely new test with the same
            questions and settings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <Button
            variant={"default"}
            onClick={() => {
              if (dataTest === undefined) return;
              setIsLoading(true);
              duplicateTest({ testId: dataTest._id }).then((newTestId) => {
                onReopened(newTestId);
                setIsLoading(false);
              });
            }}
            disabled={dataTest === undefined || isLoading}
          >
            {dataTest === undefined || isLoading ? (
              <Loader2 className="animate-spin" />
            ) : null}
            Duplicate test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
