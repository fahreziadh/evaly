import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  CircleIcon,
  CircleUserIcon,
  PencilLine,
} from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { testTypeColor, testTypeFormatter } from "@/lib/test-type-formatter";
import { Link } from "@tanstack/react-router";
import type { DataModel } from "@convex/_generated/dataModel";
import DialogDeleteTest from "./dialog-delete-test";

const CardTest = ({ data }: { data: DataModel["test"]["document"] }) => {
  const redirectLink = data.isPublished
    ? `/app/tests/details?testId=${data._id}&tabs=results`
    : `/app/tests/details?testId=${data._id}&tabs=questions`;

  return (
    <Link
      to={redirectLink}
      className="border rounded-lg transition-all duration-100 bg-card w-full active:opacity-80 flex flex-col gap-2 p-4 hover:shadow-lg shadow-muted"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{data.title || "Untitled Test"}</h3>

        <div>
          {data.isPublished && !data.finishedAt ? (
            <Badge variant={"ghost"} className="text-muted-foreground">
              <CircleIcon className="fill-success-foreground stroke-success-foreground size-3" />
              Active
            </Badge>
          ) : null}

          {!data.isPublished && !data.finishedAt ? (
            <Badge variant={"secondary"}>Draft</Badge>
          ) : null}

          {data.isPublished && data.finishedAt ? (
            <Badge variant={"success"}>
              <CheckIcon />
              Finished
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={"secondary"} className={testTypeColor(data.type)}>
            {testTypeFormatter(data.type)}
          </Badge>
          {/* {Number(data.duration || "0") > 0 ? (
              <Badge variant={"secondary"}>
                <Clock size={14} />
                <span>{`${data.duration}m`}</span>
              </Badge>
            ) : null} */}
        </div>
        <div className="flex items-center gap-1">
          <CircleUserIcon size={14} />
          <span>{data.access === "public" ? "Public" : `Private`}</span>
        </div>
        {data.heldAt && (
          <div className="flex items-center gap-1">
            Held on {dayjs(data.heldAt).format("DD MMM YYYY")}
          </div>
        )}

        <div className="ml-auto flex space-x-1">
          <Button variant={"ghost"} size={"icon-xs"}>
            <PencilLine />
          </Button>
          <Separator orientation="vertical" />
          <DialogDeleteTest testId={data._id} />
        </div>
      </div>
    </Link>
  );
};

export default CardTest;
