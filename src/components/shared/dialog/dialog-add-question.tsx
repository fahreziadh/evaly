import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { questionTypes } from "@/constants/question-type";
import { LockIcon, PencilIcon, Plus, SparklesIcon } from "lucide-react";
import { useMemo, useState } from "react";
import GenerateQuestionInputPrompt from "../generate-question-input-prompt";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ImportQuestions from "../import-questions";
import { useTranslations } from "next-intl";
import UseTemplate from "../use-template";
import { QuestionType } from "@/types/question";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

const DialogAddQuestion = ({
  order = 1,
  referenceId,
  triggerButton,
  showTabsOption = true,
  testId,
  onSuccessCreateQuestion,
}: {
  testId?: string;
  order?: number;
  referenceId: string;
  triggerButton?: React.ReactNode;
  showTabsOption?: boolean;
  onSuccessCreateQuestion?: (questionId: Id<"question">) => void;
}) => {
  const t = useTranslations("TestDetail");
  const tCommon = useTranslations("Common");
  const [selectedType, setSelectedType] = useState<QuestionType>();
  const [isOpen, setIsOpen] = useState(false);
  const createTest = useMutation(api.organizer.question.createInitialQuestions);

  const handleCreateQuestion = async (type: QuestionType) => {
    if (!order) return;
    setSelectedType(type);
    createTest({
      referenceId,
      type,
      order,
    }).then((questionId) => {
      if (questionId) {
        onSuccessCreateQuestion?.(questionId);
      }
    }).finally(() => {
      setSelectedType(undefined);
      setIsOpen(false);
    });
  };

  const groupedQuestionTypes = useMemo(() => {
    return Object.values(questionTypes).reduce(
      (acc, type) => {
        const group = type.group || "Other"; // Default group if missing
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(type);
        return acc;
      },
      {} as Record<string, (typeof questionTypes)[keyof typeof questionTypes][]>
    );
  }, []);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {triggerButton ? (
          triggerButton
        ) : (
          <Button variant={"outline"} type="button" className="w-max">
            <Plus /> Add question
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-none h-dvh flex flex-col p-0">
        <div className="container max-w-2xl overflow-y-auto pt-[10vh] pb-20">
          <DrawerHeader className="p-0">
            <DrawerTitle>{t("addQuestionTitle")}</DrawerTitle>
            <DrawerDescription>{t("addQuestionDescription")}</DrawerDescription>
          </DrawerHeader>
          <Tabs defaultValue="manual" className="mt-4 space-y-6">
            {showTabsOption ? (
              <TabsList className="divide-x gap-0 divide-dashed divide-foreground/5">
                <TabsTrigger value="manual">
                  <PencilIcon className="size-4" /> {t("manual")}
                </TabsTrigger>
                {/* <TabsTrigger value="import">
                  <UploadIcon className="size-4" /> {t("import")}
                </TabsTrigger>
                <TabsTrigger value="template">
                  <FileTextIcon className="size-4" /> {t("template")}
                </TabsTrigger> */}
                <TabsTrigger value="ai">
                  <SparklesIcon className="size-4" /> {t("ai")}
                </TabsTrigger>
              </TabsList>
            ) : null}

            <TabsContent value="manual">
              <div className="space-y-6">
                {Object.entries(groupedQuestionTypes).map(([group, types]) => (
                  <div key={group} className="">
                    <Label>{t(group)}</Label>
                    <div className="flex flex-wrap gap-3 w-full mt-2">
                      {types.map((type) => (
                        <Button
                          key={type.value}
                          variant={"outline"}
                          className="group justify-start"
                          disabled={type.isHidden || selectedType === type.value}
                          onClick={() =>
                            handleCreateQuestion(type.value as QuestionType)
                          }
                        >
                          {type.isHidden ? (
                            <LockIcon className="size-3.5" />
                          ) : (
                            <type.icon className="size-4" />
                          )}
                          {t(type.value)}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="import">
              <ImportQuestions />
            </TabsContent>

            <TabsContent value="template">
              <UseTemplate />
            </TabsContent>

            <TabsContent value="ai">
              <GenerateQuestionInputPrompt
                order={order}
                referenceId={referenceId}
                testId={testId}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="fixed bottom-0 left-0 right-0 border-t border-dashed bg-background">
          <DrawerFooter className="sm:justify-start mt-0 py-4 container max-w-2xl">
            <DrawerClose asChild>
              <Button variant={"outline"} className="w-max">
                {tCommon("backButton")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DialogAddQuestion;
