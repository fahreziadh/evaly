import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDownIcon,
  Loader2,
  PlusIcon,
} from "lucide-react";
import { useSelectedSection } from "../../_hooks/use-selected-section";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo, useState } from "react";
import CardSection from "@/components/shared/card/card-section";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Reorder } from "motion/react";
import { trpc } from "@/trpc/trpc.client";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TooltipMessage } from "@/components/ui/tooltip";
import DialogDeleteSection from "@/components/shared/dialog/dialog-delete-section";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import DialogEditSection from "@/components/shared/dialog/dialog-edit-section";

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
    return <AddSession />;
  }

  return (
    <div className="flex flex-row-reverse md:flex-row gap-2 items-center">
      <DialogDeleteSection
        testId={testId as Id<"test">}
        isLastSection={data?.length === 1}
        sectionId={selectedSection as string}
      />
      {selectedSectionData && (
        <DialogEditSection testSection={selectedSectionData} />
      )}
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
                  {selectedSectionData?.title ? (
                    <>
                      {selectedSectionData.order}. {selectedSectionData.title}
                    </>
                  ) : (
                    `Section ${selectedSectionData?.order}`
                  )}

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

const AddSession = () => {
  const testId = useSearchParams().get("testId") as Id<"test">;
  const testSections = useQuery(api.organizer.testSection.getByTestId, {
    testId: testId as Id<"test">,
  });

  const [, setSelectedSection] = useSelectedSection();
  const [isPending, setIsPending] = useState(false);

  const createTestSection = useMutation(api.organizer.testSection.create);

  const handleCreateSection = async () => {
    setIsPending(true);
    const section = await createTestSection({ testId });
    setSelectedSection(section);
    setIsPending(false);
  };

  return (
    <TooltipMessage message="Add another section">
      <Button
        variant={
          testSections?.length && testSections.length > 1 ? "ghost" : "outline"
        }
        size={
          testSections?.length && testSections.length > 1 ? "icon" : "default"
        }
        disabled={isPending}
        onClick={handleCreateSection}
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <PlusIcon className="size-4"/>
            {testSections?.length && testSections.length > 1
              ? null
              : "Multi-section"}
          </>
        )}
      </Button>
    </TooltipMessage>
  );
};

export default TestSections;
