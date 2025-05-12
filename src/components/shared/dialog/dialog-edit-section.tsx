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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TooltipMessage } from "@/components/ui/tooltip";
import { DataModel } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";

const DialogEditSection = ({
  testSection,
}: {
  testSection: DataModel["testSection"]["document"];
}) => {
  const [open, setOpen] = useState(false);
  const updateSection = useMutation(api.organizer.testSection.update);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<DataModel["testSection"]["document"]>();

  useEffect(() => {
    if (testSection) {
      reset(testSection);
    }
  }, [testSection, reset]);

  const onSubmit = (data: DataModel["testSection"]["document"]) => {
    updateSection({
      sectionId: testSection._id,
      data: {
        title: data.title,
      },
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipMessage message="Edit section">
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => {
              setOpen(true);
            }}
          >
            <PencilIcon />
          </Button>
        </TooltipMessage>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit section detail</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <Label>Title</Label>
            <Input
              placeholder="Type section's title here..."
              {...register("title")}
            />
          </div>

          <div className="hidden flex-col gap-2">
            <Label>Description (Optional)</Label>
            <Textarea
              placeholder="Type section's description here..."
              {...register("description")}
            />
          </div>
          <DialogFooter className="mt-0">
            <Button
              onClick={() => {
                setOpen(false);
              }}
              variant={"secondary"}
            >
              Back
            </Button>
            <Button disabled={!isDirty} type="submit">
              Save & exit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditSection;
