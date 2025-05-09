import { Test } from "@/types/test";
import { Link } from "../progress-bar";
import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  CircleIcon,
  CircleUserIcon,
  Clock,
  PencilLine,
} from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DialogDeleteTest from "../dialog/dialog-delete-test";
import { testTypeColor, testTypeFormatter } from "@/lib/test-type-formatter";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const CardTest = ({
  data,
  onDelete,
}: {
  data: Test;
  onDelete?: () => void;
}) => {
  const t = useTranslations("DashboardTest");
  const redirectLink = data.isPublished
    ? `/dashboard/tests/${data.id}?tabs=submissions`
    : `/dashboard/tests/${data.id}?tabs=questions`;
  return (
    <Link href={redirectLink}>
      <div
        key={data.id}
        className="border rounded-lg transition-all duration-100 bg-card hover:shadow-md shadow-black/5 w-full active:opacity-80"
      >
        <div className="flex justify-between items-start p-3">
          <div>
            <h3 className="font-medium">
              {data.title || t("untitledTestLabel")}
            </h3>
          </div>

          <div>
            {data.isPublished && !data.finishedAt ? (
              <Badge variant={"ghost"} className="text-muted-foreground">
                <CircleIcon className="fill-success-foreground stroke-success-foreground size-3" />
                {t("activeStatus")}
              </Badge>
            ) : null}

            {!data.isPublished && !data.finishedAt ? (
              <Badge variant={"secondary"}>{t("draftStatus")}</Badge>
            ) : null}

            {data.isPublished && data.finishedAt ? (
              <Badge variant={"success"}>
                <CheckIcon />
                {t("finishedStatus")}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm px-4 pb-3 text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={"secondary"} className={testTypeColor(data.type)}>
              {testTypeFormatter(data.type, t)}
            </Badge>
            {Number(data.duration || "0") > 0 ? (
              <Badge variant={"secondary"}>
                <Clock size={14} />
                <span>{`${data.duration}m`}</span>
              </Badge>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            <CircleUserIcon size={14} />
            <span>
              {data.access === "public"
                ? t("publicAccess")
                : `${data.invitations} ${t("participantsLabel")}`}
            </span>
          </div>
          {data.heldAt && (
            <div className="flex items-center gap-1">
              Held on {dayjs(data.heldAt).format("DD MMM YYYY")}
            </div>
          )}

          <div className="ml-auto flex gap-1">
            <Button variant={"ghost"} size={"icon-xs"}>
              <PencilLine />
            </Button>
            <Separator orientation="vertical" />
            <DialogDeleteTest
              testId={data.id}
              onSuccess={() => {
                toast.success(t("testDeletedMessage"));
                onDelete?.();
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardTest;
