"use client";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckIcon,
  CircleIcon,
  LinkIcon,
  Loader2,
  PencilLine,
  RotateCcw,
  Save,
  TimerOff,
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { env } from "@/lib/env.client";
import BackButton from "@/components/shared/back-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useEffect, useMemo } from "react";
import { trpc } from "@/trpc/trpc.client";
import { useTranslations } from "next-intl";
import DialogPublishTest from "@/components/shared/dialog/dialog-publish-test";
import { useTabsState } from "../_hooks/use-tabs-state";
import { cn } from "@/lib/utils";
import TestSections from "./questions/test-sections";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { PopoverClose } from "@radix-ui/react-popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { testTypeFormatter } from "@/lib/test-type-formatter";
import { testTypeColor } from "@/lib/test-type-formatter";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { DataModel, Id } from "convex/_generated/dataModel";
const Header = ({ className }: { className?: string }) => {
  const [tabs, setTabs] = useTabsState("questions");
  const { id } = useParams();
  const tOrganizer = useTranslations("Organizer");
  const t = useTranslations("DashboardTest");
  const dataTest = useQuery(api.organizer.test.getTestById, {
    testId: id as Id<"test">,
  });


  const status = useMemo(() => {
    if (dataTest?.isPublished && dataTest?.finishedAt) return "finished";
    if (dataTest?.isPublished && !dataTest?.finishedAt) return "published";
    return "draft";
  }, [dataTest]);

  useEffect(() => {
    if (dataTest) {
      // reset(dataTest);
      document.title = dataTest.title || "Untitled";
    }
  }, [dataTest]);

  const reopenTest = () => {
    // TODO: Implement reopen test
  };

  const copyLinkToShare = () => {
    navigator.clipboard.writeText(`${env.NEXT_PUBLIC_URL}/s/${dataTest?._id}`);
    toast.success("Link copied to clipboard", { position: "top-right" });
  };

  return (
    <div className={cn(className)}>
      <div className="flex md:flex-row flex-col-reverse gap-2 justify-between items-start">
        <div className="flex flex-row gap-2 items-center">
          <BackButton href={`/dashboard/tests`} />

          {/* Title and save button */}
          {dataTest === undefined ? (
            <TextShimmer className="animate-pulse  font-medium">
              Loading...
            </TextShimmer>
          ) : dataTest !== null ? (
            <DialogEditTest dataTest={dataTest} />
          ) : null}
        </div>

        {/* Right side: Status and actions */}
        <div className="flex flex-row justify-end w-full gap-2 items-center">
          <Badge
            variant={"secondary"}
            className={testTypeColor(dataTest?.type)}
            size={"lg"}
          >
            {testTypeFormatter(dataTest?.type, t)}
          </Badge>
          <div>
            {status === "published" ? (
              <Badge variant={"ghost"} size={"lg"}>
                <CircleIcon className="fill-success-foreground stroke-success-foreground size-3" />
                {t("activeStatus")}
              </Badge>
            ) : null}

            {status === "draft" ? (
              <Badge variant={"secondary"} size={"lg"}>
                {t("draftStatus")}
              </Badge>
            ) : null}

            {status === "finished" ? (
              <Badge variant={"success"} size={"lg"}>
                <CheckIcon />
                {t("finishedStatus")}
              </Badge>
            ) : null}
          </div>
          {/* Loading state */}
          {dataTest === undefined ? (
            <Button variant={"default"} disabled>
              <Loader2 className="animate-spin" />
              Loading...
            </Button>
          ) : // Published state
          status === "published" ? (
            <div className="flex flex-row items-center gap-2">
              <Button variant={"ghost"} size={"icon"} onClick={copyLinkToShare}>
                <LinkIcon />
              </Button>
              {/* <EndTestButton
                id={id?.toString() || ""}
              /> */}
            </div>
          ) : // Finished state
          status === "finished" ? (
            dataTest !== null ? (
              <DialogReopenTest dataTest={dataTest} onReopened={reopenTest} />
            ) : null
          ) : // Draft state
          status === "draft" ? (
            <DialogPublishTest
              testId={id?.toString() || ""}
              onPublished={() => {
                // reset(newTest);
                setTabs("results");
              }}
            />
          ) : null}
        </div>
      </div>

      {/* Tabs and Test Sections */}
      <div className="flex md:flex-row flex-col gap-2 justify-between items-start mb-4 mt-4">
        {dataTest === undefined ? (
          <div className="flex flex-row gap-2 items-center">
            <Skeleton className="w-56 h-9 rounded-md" />
          </div>
        ) : (
          <div className="flex md:flex-row flex-col md:items-center">
            <TabsList>
              {/* <TabsTrigger value="summary">Summary</TabsTrigger> */}
              {status === "published" || status === "finished" ? (
                <TabsTrigger value="results">
                  {tOrganizer("resultsTab")}
                </TabsTrigger>
              ) : null}
              {status === "published" ? (
                <TabsTrigger value="share">
                  {tOrganizer("shareTab")}
                </TabsTrigger>
              ) : null}
              <TabsTrigger value="questions">
                {tOrganizer("questionsTab")}
              </TabsTrigger>
              <TabsTrigger value="settings">
                {tOrganizer("settingsTab")}
              </TabsTrigger>
            </TabsList>
          </div>
        )}
        {tabs === "questions" && <TestSections />}
      </div>
    </div>
  );
};

const EndTestButton = ({
  refetchTest,
  id,
}: {
  refetchTest: () => void;
  id: string;
}) => {
  const { mutate: mutateUpdateTest, isPending: isUpdatingTest } =
    trpc.organization.test.update.useMutation({
      onSuccess() {
        toast.success("Test finished successfully");
        refetchTest();
      },
    });

  const finishTest = () => {
    mutateUpdateTest({
      id,
      finishedAt: new Date().toISOString(),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"} disabled={isUpdatingTest}>
          {isUpdatingTest ? (
            <Loader2 className="animate-spin" />
          ) : (
            <TimerOff className="mr-1" />
          )}
          End Test
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to end the test?</DialogTitle>
          <DialogDescription>
            The test will be closed and no more submissions will be allowed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex flex-row gap-2 justify-between w-full">
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <div className="flex flex-row gap-2">
              <Button
                variant={"default"}
                onClick={finishTest}
                disabled={isUpdatingTest}
              >
                {isUpdatingTest ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>End now</>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DialogReopenTest = ({
  dataTest,
  onReopened,
}: {
  dataTest?: DataModel["test"]["document"];
  onReopened: () => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <RotateCcw />
          Re-open test
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You are about to re-open the test.</DialogTitle>
          <DialogDescription>
            This action will re-create a completely new test with the same
            questions and settings, just like duplicating the test.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <Button
            variant={"default"}
            onClick={onReopened}
            disabled={dataTest === undefined}
          >
            {dataTest === undefined ? (
              <Loader2 className="animate-spin" />
            ) : (
              <RotateCcw />
            )}
            Re-open test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DialogEditTest = ({
  dataTest,
}: {
  dataTest: DataModel["test"]["document"];
}) => {
  const tCommon = useTranslations("Common");
return  <Popover>
  <PopoverTrigger className="flex flex-row items-center gap-2 cursor-pointer group">
    <span className="font-medium text-start w-max max-w-xl truncate">
      {/* {watch("title") || "Untitled"} */}
    </span>
    {dataTest === undefined ? (
      <Loader2 className="animate-spin text-muted-foreground/50" />
    ) : (
      <PencilLine className="size-4 text-muted-foreground/50 group-hover:text-muted-foreground " />
    )}
  </PopoverTrigger>
  <PopoverAnchor>
    <PopoverContent
      side="bottom"
      align="start"
      sideOffset={10}
      alignOffset={-10}
    >
      <Input
        type="text"
        // {...register("title")}
        className="outline-none font-medium"
        placeholder={
          dataTest === undefined ? "Loading..." : "Test title"
        }
        disabled={dataTest === undefined}
      />
      <PopoverClose asChild>
        <Button
          variant={"default"}
          className="w-max mt-2"
          onClick={
            () => {}
            // mutateUpdateTest({
            //   id: id?.toString() || "",
            //   title: getValues("title"),
            // })
          }
        >
          {dataTest === undefined ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Save className="size-3.5" />
          )}
          {tCommon("saveButton")}
        </Button>
      </PopoverClose>
    </PopoverContent>
  </PopoverAnchor>
</Popover>
};
export default Header;
