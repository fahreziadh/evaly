"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpdateTest } from "@/types/test";
import { CheckCircle2, Clock, LockIcon, Timer, ShieldOff } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import InviteOnly from "./invite-only";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipInfo } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { trpc } from "@/trpc/trpc.client";
import { toast } from "sonner";

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
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-20">
      <div className="flex flex-row gap-2 flex-wrap">
        <h2 className="text-sm font-semibold">{title}</h2>
        <TooltipInfo size={"icon-xs"} variant={"ghost"} className="text-muted-foreground">{description}</TooltipInfo>
      </div>
      <div className="w-full flex flex-col gap-4">{children}</div>
    </div>
  </div>
);

const Setting = () => {
  const t = useTranslations("TestDetail");
  const tCommon = useTranslations("Common");
  const { id: testId } = useParams();
  const { isPending, data } = trpc.organization.test.getById.useQuery({
    id: testId?.toString() || "",
  });
  const {
    reset,
    control,
    formState: { isDirty },
    handleSubmit,
  } = useForm<UpdateTest>();

  const { mutate: updateTest, isPending: isPendingUpdateTest } = trpc.organization.test.update.useMutation({
    onSuccess: (data) => {
      toast.success(tCommon("savedSuccessfully"));
      reset(data);
    },
    onError: (error) => {
      toast.error(error.message || tCommon("genericUpdateError"));
    },
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = (data: UpdateTest) => {
    updateTest(data);
  };

  if (isPending) {
    return <Skeleton className="w-full h-[80dvh]" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col divide-y divide-dashed mb-10">
        <SettingSection
          title={t("type")}
          description={t("typeDescription")}
        >
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
              <Label className="font-normal">
                {t("liveTestDescription")}
              </Label>
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
                  updateTest({ access: value as "public" | "invite-only", id: testId?.toString() || "" });
                }}
              >
                <TabsList className="mb-2">
                  <TabsTrigger value="public">{t("public")}</TabsTrigger>
                  <TabsTrigger value="invite-only">{t("inviteOnly")}</TabsTrigger>
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
          title={t("sectionSelectionMode")}
          description={t("sectionSelectionModeDescription")}
        >
          <Controller
            name="sectionSelectionMode"
            control={control}
            defaultValue="random"
            render={({ field }) => (
              <Tabs
                className="w-full"
                defaultValue="random"
                value={field.value || "random"}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                <TabsList className="mb-2">
                  <TabsTrigger value="random">{t("random")}</TabsTrigger>
                  <TabsTrigger value="sequential">{t("sequential")}</TabsTrigger>
                </TabsList>
                <TabsContent value="random">
                  <Label className="text-sm font-normal">
                    {t("randomDescription")}
                  </Label>
                </TabsContent>
                <TabsContent value="sequential">
                  <Label className="text-sm font-normal">
                    {t("sequentialDescription")}
                  </Label>
                </TabsContent>
              </Tabs>
            )}
          />
        </SettingSection>

        <SettingSection
          title={t("resultVisibility")}
          description={t("resultVisibilityDescription")}
        >
          <Controller
            name="resultVisibility"
            control={control}
            defaultValue="never"
            render={({ field }) => (
              <>
                <Select
                  value={field.value || "never"}
                  onValueChange={(value) => {
                    if (!value) return;
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger className="w-3xs">
                    <SelectValue placeholder="Select when to show results" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="after_completion">
                      <Timer className="h-4 w-4 mr-2" /> {t("afterCompletion")}
                    </SelectItem>
                    <SelectItem value="after_test_end">
                      <Clock className="h-4 w-4 mr-2" /> {t("afterTestEnd")}
                    </SelectItem>
                    <SelectItem value="never">
                      <ShieldOff className="h-4 w-4 mr-2" /> {t("never")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                {field.value === "after_completion" && (
                  <Label className="text-sm font-normal text-muted-foreground block">
                    {t("afterCompletionDescription")}
                  </Label>
                )}
                {field.value === "after_test_end" && (
                  <Label className="text-sm font-normal text-muted-foreground block">
                    {t("afterTestEndDescription")}
                  </Label>
                )}
                {field.value === "never" && (
                  <Label className="text-sm font-normal text-muted-foreground block">
                    {t("neverDescription")}
                  </Label>
                )}
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

      <div className="fixed w-full bottom-0 left-0 flex flex-row items-center justify-end gap-4 px-4 sm:px-8 py-4 border-t bg-background z-50">
        <div className="container">
          <Button
            disabled={!isDirty}
            type="submit"
            variant={isDirty ? "default" : "outline"}
          >
            {isPendingUpdateTest ? tCommon("savingStatus") : tCommon("saveChanges")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Setting;
