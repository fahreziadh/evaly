"use client";
import {
  ArrowRight,
  CheckCircle,
  Loader2,
  LockIcon,
  PlusIcon,
} from "lucide-react";
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
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useProgressRouter } from "../progress-bar";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

const DialogCreateTest = () => {
  const [open, setOpen] = useState(false);
  const router = useProgressRouter();
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("TestDialogs");
  const tCommon = useTranslations("Common");

  const createTest = useMutation(api.organizer.test.createTest);

  const onCreateNewTest = async () => {
    try {
      setIsPending(true);
      const test = await createTest({ type: "self-paced" });
      if (!test) {
        toast.error(tCommon("genericError"));
        return;
      }
      setIsPending(false);
      router.push(`/dashboard/tests?testId=${test}&tabs=questions`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : tCommon("genericError")
      );
    }
  };

  const onBack = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>
          <PlusIcon />
          {t("createTestButton")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("createTestTitle")}</DialogTitle>
          <DialogDescription>{t("createTestDescription")}</DialogDescription>
        </DialogHeader>
        <Card className="p-4 cursor-pointer ring-2 ring-offset-2">
          <div className="flex flex-row items-start justify-between">
            <h1>{t("selfPacedTestLabel")}</h1>
            <CheckCircle size={20} />
          </div>
          <Label className="text-sm">{t("selfPacedTestDescription")}</Label>
        </Card>
        <Card className="p-4 opacity-80">
          <div className="flex flex-row items-start justify-between">
            <h1>{t("liveTestLabel")}</h1>
            <Badge variant={"secondary"}>
              <LockIcon /> {tCommon("comingSoon")}
            </Badge>
          </div>
          <Label className="text-sm">{t("liveTestDescription")}</Label>
        </Card>
        <DialogFooter>
          <Button variant={"secondary"} onClick={onBack}>
            {tCommon("backButton")}
          </Button>
          <Button
            variant={"default"}
            onClick={onCreateNewTest}
            disabled={isPending}
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
            {tCommon("continueButton")}
            {!isPending ? <ArrowRight size={16} /> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateTest;
