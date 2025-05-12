"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, LockIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import InviteOnly from "./invite-only";
import { Textarea } from "@/components/ui/textarea";
import { TooltipInfo } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { DataModel, Id } from "convex/_generated/dataModel";

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
      <div className="flex flex-row gap-2 flex-wrap items-center">
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
  const t = useTranslations("TestDetail");
  const tCommon = useTranslations("Common");
  const testId = useSearchParams().get("testId") as Id<"test">;
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
      <div className="flex flex-col divide-y divide-dashed mb-10">
        <SettingSection title={t("type")} description={t("typeDescription")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="w-full p-3 border-foreground cursor-pointer relative">
              <CheckCircle2 size={18} className="absolute top-2 right-2" />
              <h3 className="font-medium mb-2">{t("selfPacedTest")}</h3>
              <Label className="font-normal">
                {t("selfPacedTestDescription")}
              </Label>
            </Card>

            <Card className="w-full p-3 opacity-70 ring-offset-4 ring-foreground/50 transition-all relative">
              <LockIcon
                size={18}
                className="absolute top-2 right-2 opacity-50"
              />
              <h3 className="font-medium mb-2">{t("liveTest")}</h3>
              <Label className="font-normal">{t("liveTestDescription")}</Label>
            </Card>
          </div>
        </SettingSection>

        <SettingSection
          title={t("access")}
          description={t("accessDescription")}
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
                  <TabsTrigger value="public">{t("public")}</TabsTrigger>
                  <TabsTrigger value="private">{t("private")}</TabsTrigger>
                </TabsList>
                <TabsContent value="public">
                  <Label className="text-sm font-normal">
                    {t("publicDescription")}
                  </Label>
                </TabsContent>
                <TabsContent value="invite-only">
                  <InviteOnly testId={testId?.toString() || ""} />
                </TabsContent>
              </Tabs>
            )}
          />
        </SettingSection>

        <SettingSection
          title={t("showResultImmediately")}
          description={t("showResultImmediatelyDescription")}
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
          title={t("description")}
          description={t("descriptionDescription")}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                placeholder={t("descriptionPlaceholder")}
                value={field.value || ""}
                className="resize-none min-h-[140px] text-base p-4 w-full"
                onChange={field.onChange}
              />
            )}
          />
        </SettingSection>
      </div>

      <div className="fixed w-full bottom-0 left-0 flex flex-row items-center justify-end gap-4 px-4 sm:px-8 py-3 border-t bg-background z-50">
          <Button
            disabled={!isDirty}
            type="submit"
            variant={isDirty ? "default" : "outline"}
          >
            {tCommon("saveChanges")}
          </Button>
        </div>
    </form>
  );
};

export default Setting;
