import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/trpc.client";
import { CircleHelpIcon, ClockIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DialogEditSectionDuration = ({
  className,
  disabled = false,
  onSuccess,
  sectionId,
  testId,
}: {
  className?: string;
  disabled?: boolean;
  sectionId: string; // Made optional since it's not used in the component
  onSuccess?: () => void;
  testId: string;
}) => {
  const [open, setOpen] = useState(false);

  const {
    data: dataSection,
    isRefetching: isRefetchingSection,
    refetch: refetchSection,
  } = trpc.organization.testSection.getById.useQuery(
    {
      id: sectionId as string,
    },
    {
      enabled: !!sectionId,
    }
  );

  const { refetch: refetchSections } =
    trpc.organization.testSection.getAll.useQuery(
      {
        testId: testId as string,
      },
      {
        enabled: !!testId,
      }
    );

  const { mutate: updateSection, isPending: isPendingUpdateSection } =
    trpc.organization.testSection.update.useMutation({
      onSuccess: async () => {
        await refetchSection();
        await refetchSections();
        onSuccess?.();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  // States for the form inputs - initialize directly from value prop
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    let hours = 0;
    let minutes = 0;

    if (dataSection) {
      hours = Math.floor((dataSection.duration || 0) / 60);
      minutes = (dataSection.duration || 0) % 60;
    }

    setHours(hours);
    setMinutes(minutes);
  }, [dataSection]);

  const handleSave = async () => {
    const newTotalMinutes = hours * 60 + minutes;

    updateSection({
      id: sectionId as string,
      data: {
        duration: newTotalMinutes,
      },
    });
  };
  return null;
  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          // set the value to the original value
          setHours(Math.floor((dataSection?.duration || 0) / 60));
          setMinutes((dataSection?.duration || 0) % 60);
        }
        setOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          size={"xs"}
          variant={"ghost"}
          className={cn(className)}
          onClick={(e) => e.stopPropagation()}
        >
          <ClockIcon /> {hours > 0 ? `${hours}h ` : ""}
          {minutes}m
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max">
        <div className="flex flex-row gap-2 items-center">
          <Label>Duration</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"ghost"} size={"icon-xs"}>
                <CircleHelpIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              If you want participants to be able to finish the test whenever
              they want, you can leave the duration empty.
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-cols-2 gap-4">
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
                  e.target.value === "" ? 0 : Number(e.target.value);
                setHours(value);
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
                  e.target.value === "" ? 0 : Number(e.target.value);
                if (value > 59) {
                  toast.error("Minutes must be between 0 and 59");
                  return;
                }
                setMinutes(value);
              }}
            />
          </div>
          <Button
            disabled={isPendingUpdateSection || isRefetchingSection}
            onClick={handleSave}
            type="button"
            className="w-full col-span-2"
          >
            {isPendingUpdateSection ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DialogEditSectionDuration;
