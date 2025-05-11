import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/trpc.client";
import dayjs from "dayjs";
import {
  FileText,
  Smile,
  WandSparkles,
  Search,
  Calendar,
  MinusIcon,
  EyeIcon,
  BookOpen,
  Loader2,
  Plus,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";

export const QuestionTemplateSection = ({
  onSelectedIdChange,
  selectedId,
}: {
  selectedId?: string;
  onSelectedIdChange?: (id: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("all"));

  const { data: dataQuestionTemplate } = trpc.organization.questionTemplate.getAll.useQuery();

  const filteredDataQuestionTemplate = useMemo(() => {
    if (!dataQuestionTemplate) return [];
    let list = dataQuestionTemplate;
    if (tab === "all") list = dataQuestionTemplate;
    if (tab === "owned")
      list = dataQuestionTemplate.filter((e) => {
        return !e.isAiGenerated;
      });

    if (tab === "generated")
      list = dataQuestionTemplate.filter((e) => {
        return e.isAiGenerated;
      });

    if (!searchQuery) return list;

    return list.filter((template) => {
      if (!template.title) return false;
      return (
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
  }, [dataQuestionTemplate, searchQuery, tab]);

  return (
    <div className={cn("space-y-6")}>
      <Tabs className="w-full" value={tab} onValueChange={setTab}>
        <div className="flex flex-col-reverse gap-4 md:flex-row justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">
              <FileText className="size-3.5" />
              All
            </TabsTrigger>
            <TabsTrigger value="owned">
              <Smile className="size-3.5" />
              My Templates
            </TabsTrigger>
            <TabsTrigger value="generated">
              <WandSparkles className="size-3.5" />
              AI Generated
            </TabsTrigger>
          </TabsList>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-8"
              value={searchQuery ?? ""}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Owned Templates Tab */}
        {filteredDataQuestionTemplate &&
        filteredDataQuestionTemplate?.length > 0 ? (
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            )}
          >
            {filteredDataQuestionTemplate?.map((template) => (
             <CardQuestionTemplate
             key={template.id}
             template={template}
             onClick={() =>
               template.id === selectedId
                 ? onSelectedIdChange?.("")
                 : onSelectedIdChange?.(template.id)
             }
             isSelected={template.id === selectedId}
           />
            ))}
          </div>
        ) : (
          <EmptyState message="No templates match your search" />
        )}
      </Tabs>
    </div>
  );
};

const CardQuestionTemplate = ({
  template,
  onClick,
  isSelected,
}: {
  template: {
    id: string;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    deletedAt: string | null;
    title: string | null;
    organizerId: string;
    tags: string[];
    isAiGenerated: boolean;
    questions: {
      id: string;
      question: string | null;
    }[];
  };
  onClick?: () => void;
  isSelected?: boolean;
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "overflow-hidden cursor-pointer group border-border h-full hover:shadow-2xl hover:shadow-black/5",
        "bg-card hover:bg-muted/20",
        isSelected ? "border-primary" : ""
      )}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-1">
              {template.title || "Untitled"}
            </CardTitle>
            {/* <CardDescription className="text-xs mt-1">
                  {template.title}
                </CardDescription> */}
          </div>
          <Link href={`/dashboard/question/${template.id}`} target="_blank" className="invisible group-hover:visible">
            <Button variant="ghost" size="icon">
              <EyeIcon className="size-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3 px-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <FileText className="size-3 mr-1" />
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (template as any).totalQuestions
            }{" "}
            questions
          </div>
          <div className="flex items-center">
            <Calendar className="size-3 mr-1" />
            {dayjs(template.createdAt).format("DD MMM YYYY")}
          </div>
        </div>

        {/* Question Highlights */}
        <div className="space-y-1.5">
          {template.questions?.map((question) => {
            return (
              <div
                key={question.id}
                className="flex items-center gap-1.5 text-xs"
              >
                <div className="flex-shrink-0 size-3 rounded-full bg-muted/50 flex items-center justify-center">
                  <MinusIcon className="size-3" />
                </div>
                <div
                  className="flex-1 line-clamp-1 text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: question.question || "No preview available",
                  }}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex flex-wrap gap-1">
          {template.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

const EmptyState = ({
  message,
  icon,
}: {
  message: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-muted/20 rounded-lg border border-dashed">
      <div className="bg-background rounded-full p-4">
        {icon || <BookOpen className="size-20 text-muted-foreground" />}
      </div>
      <p className="text-muted-foreground mt-2 mb-1">{message}</p>
      <p className="text-xs text-muted-foreground/70 mb-4">
        Try adjusting your search or browse all templates
      </p>
      <CreateQuestionTemplateButton />
    </div>
  );
};

const CreateQuestionTemplateButton = () => {
  const router = useRouter();
  const [transitionReady, startTransition] = useTransition();

  const { mutate: createQuestionTemplate, isPending: isLoading } = trpc.organization.questionTemplate.create.useMutation({
    onError(error) {
      toast.error(error.message || "Failed to create question template");
    },
    onSuccess(data) {
      toast.success("Question template created successfully");
      startTransition(() => {
        router.push(`/dashboard/question/${data.id}`);
      });
    },
  });

  return (
    <Button
      variant={"outline"}
      onClick={() => createQuestionTemplate({ title: "" })}
      disabled={transitionReady || isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Creating...</span>
        </>
      ) : transitionReady ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Redirecting...</span>
        </>
      ) : (
        <>
          <Plus /> Question template
        </>
      )}
    </Button>
  );
};