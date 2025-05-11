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
import { CircleHelpIcon, Loader2, PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UpdateTestSection } from "@/types/test";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trpc } from "@/trpc/trpc.client";
import { TooltipMessage } from "@/components/ui/tooltip";

const DialogEditSection = ({ sectionId }: { sectionId: string }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm<UpdateTestSection>();

  const {
    data: dataSection,
    refetch: refetchSection,
    isRefetching: isRefetchingSection,
  } = trpc.organization.testSection.getById.useQuery(
    {
      id: sectionId,
    },
    {
      enabled: !!sectionId,
    }
  );

  useEffect(() => {
    if (dataSection) {
      reset(dataSection);
    }
  }, [dataSection, reset]);

  const { mutate: updateSection, isPending: isPendingUpdateSection } =
    trpc.organization.testSection.update.useMutation({
      onSuccess: async () => {
        await refetchSection();
        setOpen(false);
      },
    });

  const onSubmit = (data: UpdateTestSection) => {
    updateSection({
      id: sectionId,
      data: {
        ...data,
        duration: data.duration || 0, // Ensure duration is a number, not null or undefined
      },
    });
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
          className="flex flex-col gap-6 mt-4"
        >
          <div className="flex flex-col gap-2">
            <Label>Title</Label>
            <Input
              placeholder="Type section's title here..."
              {...register("title")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <Label>Duration</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"ghost"} size={"icon-xs"}>
                    <CircleHelpIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  If you want participants to be able to finish the test
                  whenever they want, you can leave the duration empty.
                </PopoverContent>
              </Popover>
            </div>
            <Controller
              control={control}
              name="duration"
              render={({ field }) => {
                const hours = Math.floor((field.value || 0) / 60);
                const minutes = (field.value || 0) % 60 || 0;
                return (
                  <>
                    <div className="flex flex-row gap-4">
                      <div>
                        <Label>Hours</Label>
                        <Input
                          type="number"
                          className="w-20"
                          min={0}
                          max={23}
                          placeholder="0-23"
                          value={hours === 0 && !hours ? "" : hours}
                          onChange={(e) => {
                            if (Number(e.target.value) > 23) {
                              toast.error("Hours must be between 0 and 23");
                              return;
                            }
                            const value =
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value);
                            field.onChange(value * 60 + minutes);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Minutes</Label>
                        <Input
                          type="number"
                          className="w-20"
                          value={minutes === 0 && !minutes ? "" : minutes}
                          min={0}
                          max={59}
                          placeholder="0-59"
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value);
                            if (value > 59) {
                              toast.error("Minutes must be between 0 and 59");
                              return;
                            }
                            field.onChange(value + hours * 60);
                          }}
                        />
                      </div>
                    </div>
                  </>
                );
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
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
            <Button
              disabled={
                isPendingUpdateSection || !isDirty || isRefetchingSection
              }
              type="submit"
            >
              {isPendingUpdateSection || isRefetchingSection ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save & exit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditSection;
