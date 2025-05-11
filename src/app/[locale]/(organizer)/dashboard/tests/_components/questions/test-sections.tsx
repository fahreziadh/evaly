import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDownIcon,
  Loader2,
  PlusIcon,
  PointerIcon,
} from "lucide-react";
import { useSelectedSection } from "../../_hooks/use-selected-section";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo, useState } from "react";
import CardSection from "@/components/shared/card/card-section";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Reorder } from "motion/react";
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
import { QuestionTemplateSection } from "./question-template-section";
import { toast } from "sonner";
import { trpc } from "@/trpc/trpc.client";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TooltipMessage } from "@/components/ui/tooltip";
import DialogDeleteSection from "@/components/shared/dialog/dialog-delete-section";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

const TestSections = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const testId = useSearchParams().get("testId") as Id<"test">;
  const [selectedSection, setSelectedSection] = useSelectedSection();

  const data = useQuery(api.organizer.testSection.getByTestId, {
    testId: testId as Id<"test">,
  });

  const selectedSectionData = useMemo(() => {
    if (!selectedSection || !data) return null;
    return data.find((e) => e._id === selectedSection);
  }, [selectedSection, data]);

  if (data === undefined) {
    return (
      <div className="flex flex-row gap-2 items-center">
        <Skeleton className="w-40 h-8 rounded-md" />
      </div>
    );
  }

  if (data?.length === 1) {
    return (
      <div className="flex flex-row gap-2 items-center">
        <AddSession>
          <Button variant={"outline"}>
            <PlusIcon /> New section
          </Button>
        </AddSession>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse md:flex-row gap-2 items-center">
      <DialogDeleteSection
        isLastSection={data?.length === 1}
        sectionId={selectedSection as string}
      />
      {/* <DialogEditSection sectionId={selectedSection as string} /> */}
      <AddSession />

      <div className={cn("flex flex-row", className)}>
        <Button
          onClick={() => {
            const order = selectedSectionData?.order;
            if (!order) return;
            if (order === 1) return;

            const previousSection = data?.find((e) => e.order === order - 1);
            if (previousSection) {
              setSelectedSection(previousSection._id);
            }
          }}
          disabled={selectedSectionData?.order === 1}
          variant={"outline"}
          size={"icon"}
          className="border-r-0 rounded-r-none"
        >
          <ArrowLeft />
        </Button>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div>
              <TooltipMessage message="Click to check all sections">
                <Button
                  variant={"outline"}
                  className="rounded-r-none rounded-l-none group"
                >
                  <span>
                    {selectedSectionData?.order || 1}.{" "}
                    {selectedSectionData?.title || "Untitled"}
                  </span>
                  {selectedSectionData?.duration &&
                  selectedSectionData?.duration > 0 ? (
                    <Badge variant={"secondary"}>
                      {selectedSectionData.duration}m
                    </Badge>
                  ) : null}
                  <ChevronDownIcon className={cn(isOpen ? "rotate-180" : "")} />
                </Button>
              </TooltipMessage>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <ListSession />
          </PopoverContent>
        </Popover>

        <Button
          onClick={() => {
            const order = selectedSectionData?.order;
            if (!order) return;
            if (order === data?.length) return;

            const nextSection = data?.find((e) => e.order === order + 1);
            if (nextSection) {
              setSelectedSection(nextSection._id);
            }
          }}
          disabled={selectedSectionData?.order === data?.length}
          variant={"outline"}
          size={"icon"}
          className="rounded-l-none border-l-0"
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

const ListSession = () => {
  const testId = useSearchParams().get("testId") as Id<"test">;
  const [selectedSection, setSelectedSection] = useSelectedSection();

  const data = useQuery(api.organizer.testSection.getByTestId, {
    testId: testId as Id<"test">,
  });

  const [orderedData, setOrderedData] = useState<typeof data>([]);

  useEffect(() => {
    if (data) {
      setOrderedData(data);
    }
  }, [data]);

  useEffect(() => {
    if (data?.length && !selectedSection) {
      setSelectedSection(data[0]._id);
    }
  }, [data, selectedSection, setSelectedSection]);

  const { mutateAsync: updateOrder, isPending: isPendingUpdateOrder } =
    trpc.organization.testSection.updateOrder.useMutation();

  const onChangeOrder = async () => {
    const sectionIds = orderedData?.map((e) => e._id) || [];
    await updateOrder({ testId: testId as string, order: sectionIds });
  };

  if (data === undefined) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
      </div>
    );
  }

  if (!data || !data.length || !orderedData) {
    return <div>No session found</div>;
  }

  return (
    <ScrollArea>
      <Reorder.Group
        className={cn(
          "flex flex-col gap-2 max-h-[60vh]",
          isPendingUpdateOrder ? "animate-pulse opacity-80" : ""
        )}
        axis="y"
        values={orderedData}
        onReorder={setOrderedData}
      >
        {orderedData?.map((e) => (
          <Reorder.Item
            key={e._id}
            value={e}
            onDragEnd={onChangeOrder}
            dragListener={isPendingUpdateOrder ? false : true}
          >
            <CardSection
              data={e}
              key={e._id}
              isSelected={e._id === selectedSection}
              onClick={() => setSelectedSection(e._id)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <ScrollBar />
    </ScrollArea>
  );
};

const AddSession = ({ children }: { children?: React.ReactNode }) => {
  const testId = useSearchParams().get("testId") as Id<"test">;
  const [, setSelectedSection] = useSelectedSection();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const tCommon = useTranslations("Common");

  const { mutateAsync, isPending: isPendingCreateSection } =
    trpc.organization.testSection.create.useMutation();

  const { mutateAsync: tranferQuestion, isPending: isPendingTransferQuestion } =
    trpc.organization.question.transferBetweenReference.useMutation({
      onError(error) {
        toast.error(error.message || tCommon("genericUpdateError"));
      },
    });

  async function onUseTemplate() {
    if (!selectedId) return;
    const createdSection = await mutateAsync({ testId: testId as string });
    if (!createdSection?.sections?.length) {
      toast.error("Something went wrong!");
      return;
    }
    const order = 1;
    const toReferenceId = createdSection?.sections[0]?.id;
    const fromReferenceId = selectedId;

    const transferredQuestion = await tranferQuestion({
      order: Number(order),
      toReferenceId: toReferenceId as string,
      fromReferenceId,
    });

    if (transferredQuestion && transferredQuestion.length > 0) {
      const sectionId = createdSection?.sections[0]?.id;
      setIsOpen(false);
      if (sectionId) {
        setSelectedSection(sectionId);
      }
    }
  }

  return (
    <div className="flex flex-col items-end">
      <Dialog
        open={isOpen}
        onOpenChange={(e) => {
          if (!e) setSelectedId("");
          setIsOpen(e);
        }}
      >
        <DialogTrigger asChild>
          <div>
            <TooltipMessage message="Add new section">
              {children || (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  disabled={
                    isPendingCreateSection
                  }
                >
                  {isPendingCreateSection ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <PlusIcon className="size-4" />
                  )}
                </Button>
              )}
            </TooltipMessage>
          </div>
        </DialogTrigger>
        <DialogContent className="md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
          <DialogHeader>
            <DialogTitle>Add new section</DialogTitle>
            <DialogDescription className="flex flex-wrap">
              Add an empty section or use a question template. Click to
              selecting the template <PointerIcon className="size-4 ml-2" />
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[40vh]">
            <QuestionTemplateSection
              onSelectedIdChange={setSelectedId}
              selectedId={selectedId}
            />
          </ScrollArea>
          <DialogFooter>
            <div className="flex flex-row justify-between w-full">
              <DialogClose asChild>
                <Button variant={"secondary"}>Back</Button>
              </DialogClose>

              <div className="flex gap-2">
                <Button
                  variant={"outline"}
                  className="w-max"
                  disabled={isPendingCreateSection}
                  onClick={async () => {
                    const data = await mutateAsync({ testId: testId as string });
                    const sectionId = data?.sections[0]?.id;
                    setIsOpen(false);
                    if (sectionId) {
                      setSelectedSection(sectionId);
                    }
                  }}
                >
                  {isPendingCreateSection ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <PlusIcon />
                  )}
                  Create Empty Section
                </Button>
                <Button
                  onClick={onUseTemplate}
                  variant={"default"}
                  disabled={
                    !selectedId ||
                    isPendingTransferQuestion ||
                    isPendingCreateSection
                  }
                >
                  {selectedId ? (
                    <>
                      Use template <ArrowRight />
                    </>
                  ) : (
                    "Choose template"
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestSections;
