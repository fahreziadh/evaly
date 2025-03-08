import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { $api } from "@/lib/api";
import { useTestByIdQuery } from "@/query/organization/test/use-test-by-id.query";
import { useMutation } from "@tanstack/react-query";
import { UpdateTest } from "@evaly/backend/types/test";
import { CheckCircle2, LockIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Editor } from "@/components/shared/editor/editor";
import DialogTestDescriptionTemplate from "@/components/shared/dialog/dialog-test-description-template";
import InviteOnly from "./invite-only";
import { AnimatePresence, motion } from "motion/react";

const Setting = () => {
  const { id: testId } = useParams();
  const { isPending, data } = useTestByIdQuery({
    id: testId?.toString() || "",
  });

  const {
    reset,
    control,
    formState: { isDirty },
    handleSubmit,
  } = useForm<UpdateTest>();

  const { mutate: updateTest, isPending: isPendingUpdateTest } = useMutation({
    mutationKey: ["update-test"],
    mutationFn: async (data: UpdateTest) => {
      const response = await $api.organization
        .test({ id: testId?.toString() || "" })
        .put(data);

      return response.data;
    },
    onSuccess(data) {
      if (!data) {
        throw new Error("Failed to update test. Please try again later.");
      }

      reset(data);
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
      <div className="flex flex-col divide-y">
        <div className="flex flex-row gap-10 pb-8">
          <div className="w-2xs">
            <h1 className="font-semibold">Type</h1>
            <Label>
              This determines how candidates will interact with your assessment.
            </Label>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <Card className="w-full p-3 border-foreground cursor-pointer relative">
              <CheckCircle2 size={18} className="absolute top-2 right-2" />
              <h1 className="font-medium mb-2">Self-paced Test</h1>
              <Label>
                Allow candidates to take the test at their own pace. Ideal for
                screening and pre-assessment purposes.
              </Label>
            </Card>

            <Card className="w-full p-3 opacity-70 ring-offset-4 ring-foreground/50 transition-all relative">
              <LockIcon
                size={18}
                className="absolute top-2 right-2 opacity-50"
              />
              <h1 className="font-medium mb-2">Live Test</h1>
              <Label>
                Schedule a synchronized test for all candidates. Ideal for final
                assessments and examinations.
              </Label>
            </Card>
          </div>
        </div>

        <div className="flex flex-row gap-10 py-8">
          <div className="w-2xs">
            <h1 className="font-semibold">Access</h1>
            <Label>
              Control who can access your test. Public tests are visible to
              anyone.
            </Label>
          </div>
          <Controller
            name="access"
            control={control}
            defaultValue="public"
            render={({ field }) => (
              <Tabs
                className="flex-1"
                defaultValue="public"
                value={field.value || "public"}
                onValueChange={(value) => {
                  field.onChange(value);
                  updateTest({ access: value as "public" | "invite-only" });
                }}
              >
                <TabsList>
                  <TabsTrigger value="public">Public</TabsTrigger>
                  <TabsTrigger value="invite-only">Invite Only</TabsTrigger>
                </TabsList>
                <TabsContent value="public">
                  <Label className="text-sm">
                    Anyone with the link can access and take this test. The test
                    will be publicly listed on your profile.
                  </Label>
                </TabsContent>
                <TabsContent value="invite-only">
                  <InviteOnly testId={testId?.toString() || ""} />
                </TabsContent>
              </Tabs>
            )}
          />
        </div>

        <div className="flex flex-row gap-10 py-8">
          <div className="w-2xs">
            <h1 className="font-semibold">Description</h1>
            <Label>
              Add a description to provide more information about your test to
              candidates.
            </Label>
          </div>
          <div className="flex-1">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div>
                  <Editor
                    placeholder="Type test's description here...."
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                  <DialogTestDescriptionTemplate
                    className="w-max mt-4"
                    onSelect={field.onChange}
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isDirty ? (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="fixed w-full bottom-0 left-0 flex flex-row items-center justify-end gap-4 px-8 py-4 border-t bg-background z-50"
          >
            <Button disabled={!isDirty} type="submit" size={"lg"}>
              {isPendingUpdateTest ? "Saving..." : "Save changes"}
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </form>
  );
};

export default Setting;
