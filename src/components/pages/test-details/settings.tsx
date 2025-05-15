"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, LockIcon } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { TooltipInfo } from "@/components/ui/tooltip";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { DataModel, Id } from "@convex/_generated/dataModel";
import { useSearch } from "@tanstack/react-router";
import { Editor } from "@/components/shared/editor/editor";

type SettingSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const SettingSection = ({
  title,
  description,
  children,
}: SettingSectionProps) => (
  <div className="py-4 first:pt-0 last:pb-0">
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-20">
      <div className="flex flex-row gap-2 flex-wrap items-start">
        <h2 className="text-sm font-semibold">{title}</h2>
        <TooltipInfo
          size={"icon-xs"}
          variant={"ghost"}
          className="text-muted-foreground"
        >
          {description}
        </TooltipInfo>
      </div>
      <div className="w-full flex flex-col gap-4">{children}</div>
    </div>
  </div>
);

const Setting = () => {
  const { testId } = useSearch({ from: "/(organizer)/app/tests/details" });
  const dataTest = useQuery(api.organizer.test.getTestById, {
    testId: testId as Id<"test">,
  });

  const updateTest = useMutation(
    api.organizer.test.updateTest
  ).withOptimisticUpdate((localStore, args) => {
    const currentValue = localStore.getQuery(api.organizer.test.getTestById, {
      testId: args.testId,
    });
    if (!currentValue) return;
    localStore.setQuery(
      api.organizer.test.getTestById,
      { testId: args.testId },
      {
        ...currentValue,
        ...args.data,
      }
    );
  });

  const {
    reset,
    control,
    formState: { isDirty },
    handleSubmit,
  } = useForm<DataModel["test"]["document"]>();

  useEffect(() => {
    if (dataTest) {
      reset(dataTest);
    }
  }, [dataTest, reset]);

  const onSubmit = (data: DataModel["test"]["document"]) => {
    if (!dataTest?._id) return;
    updateTest({
      testId: dataTest?._id,
      data: {
        type: data.type,
        title: data.title,
        access: data.access,
        showResultImmediately: data.showResultImmediately,
        isPublished: data.isPublished,
        description: data.description || "",
      },
    });
  };

  if (dataTest === undefined) {
    return <Skeleton className="w-full h-[80dvh]" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col divide-y divide-dashed mb-10 border p-6 rounded-md">
        <div className="flex flex-row items-center justify-between gap-4 pb-4">
          <h1 className="font-medium">Test Settings</h1>
          <Button
            disabled={!isDirty}
            type="submit"
            variant={isDirty ? "default" : "outline"}
          >
            Save Changes
          </Button>
        </div>
        <SettingSection
          title={"Type"}
          description={"Select the type of test you want to create"}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="w-full p-3 border-foreground cursor-pointer relative">
              <CheckCircle2 size={18} className="absolute top-2 right-2" />
              <h3 className="font-medium mb-2">Self-Paced Test</h3>
              <Label className="font-normal">
                Self-paced tests allow candidates to take the test at their own
                pace, without any time constraints.
              </Label>
            </Card>

            <Card className="w-full p-3 opacity-70 ring-offset-4 ring-foreground/50 transition-all relative">
              <LockIcon
                size={18}
                className="absolute top-2 right-2 opacity-50"
              />
              <h3 className="font-medium mb-2">Live Test</h3>
              <Label className="font-normal">
                Live tests are timed and candidates must complete the test
                within a specific time limit.
              </Label>
            </Card>
          </div>
        </SettingSection>

        {/* <SettingSection
          title={"Access"}
          description={"Select the access type for the test"}
        >
          <Controller
            name="access"
            control={control}
            defaultValue="public"
            render={({ field }) => (
              <Tabs
                className="w-full"
                defaultValue="public"
                value={field.value || "public"}
                onValueChange={(value) => {
                  field.onChange(value);
                  if (!dataTest?._id) return;
                  onSubmit({
                    ...dataTest,
                    access: value as "public" | "private",
                  });
                }}
              >
                <TabsList className="mb-2">
                  <TabsTrigger value="public">Public</TabsTrigger>
                  <TabsTrigger value="private">Private</TabsTrigger>
                </TabsList>
                <TabsContent value="public">
                  <Label className="text-sm font-normal">
                    Public tests are visible to all candidates.
                  </Label>
                </TabsContent>
                <TabsContent value="private">
                  <Label className="text-sm font-normal">
                    Private tests are visible only to the candidates who have been invited.
                  </Label>
                </TabsContent>
              </Tabs>
            )}
          />
        </SettingSection> */}

        <SettingSection
          title={"Show Result Immediately"}
          description={
            "Select whether the test results should be shown immediately after the test is completed."
          }
        >
          <Controller
            name="showResultImmediately"
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <>
                <Tabs
                  className="w-full"
                  defaultValue={field.value ? "true" : "false"}
                  value={field.value ? "true" : "false"}
                  onValueChange={(value) => {
                    field.onChange(value === "true");
                  }}
                >
                  <TabsList>
                    <TabsTrigger value="true">Yes</TabsTrigger>
                    <TabsTrigger value="false">No</TabsTrigger>
                  </TabsList>
                  <TabsContent value="true">
                    <Label className="text-sm font-normal text-muted-foreground block">
                      Results will be shown immediately after the test is
                      completed.
                    </Label>
                  </TabsContent>
                  <TabsContent value="false">
                    <Label className="text-sm font-normal text-muted-foreground block">
                      Results can only be viewed if organizer has published the
                      results.
                    </Label>
                  </TabsContent>
                </Tabs>
              </>
            )}
          />
        </SettingSection>

        <SettingSection
          title={"Description"}
          description={"Enter a description for the test"}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Editor
                placeholder={"Enter a description for the test"}
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />
        </SettingSection>
      </div>
    </form>
  );
};

export default Setting;
