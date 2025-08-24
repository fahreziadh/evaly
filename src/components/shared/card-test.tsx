import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { testTypeFormatter } from "@/lib/test-type-formatter";
import type { DataModel } from "@convex/_generated/dataModel";
import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCountdown } from "@/hooks/use-countdown";
import {
  CheckIcon,
  CircleIcon,
  CircleUserIcon,
  PencilLine,
  ClockIcon,
} from "lucide-react";

dayjs.extend(relativeTime);
import DialogDeleteTest from "./dialog-delete-test";
import { Label } from "../ui/label";

const CardTest = ({ data }: { data: DataModel["test"]["document"] }) => {
  const now = Date.now();
  const scheduledStart = data.scheduledStartAt;
  const scheduledEnd = data.scheduledEndAt;
  const finished = data.finishedAt;
  
  const status = (() => {
    // Test is finished
    if (finished || (scheduledEnd && now > scheduledEnd)) return "finished";
    
    // Test is published and active
    if (data.isPublished && !finished) return "active";
    
    // Test is scheduled but not started yet
    if (scheduledStart && now < scheduledStart) return "scheduled";
    
    return "draft";
  })();
  
  const countdownTarget = (() => {
    if (status === "scheduled" && scheduledStart) return scheduledStart;
    if (status === "active" && scheduledEnd && now < scheduledEnd) return scheduledEnd;
    return undefined;
  })();
  
  const { timeLeft } = useCountdown(countdownTarget);
  
  const redirectLink = (status === "active" || status === "finished")
    ? `/app/tests/details?testId=${data._id}&tabs=results`
    : `/app/tests/details?testId=${data._id}&tabs=questions`;

  return (
    <Link
      to={redirectLink}
      className="bg-card w-full active:opacity-80 flex flex-col gap-2 p-4 hover:opacity-70"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-normal">{data.title || "Untitled Test"}</h3>

        <div className="flex flex-col items-end gap-1">
          <Badge 
            variant={
              status === "draft" 
                ? "outline" 
                : status === "scheduled" 
                  ? "secondary" 
                  : status === "active" 
                    ? "ghost" 
                    : "success"
            } 
            className={status === "active" ? "text-muted-foreground" : ""}
          >
            {status === "active" ? (
              <CircleIcon className="fill-success-foreground stroke-success-foreground size-3" />
            ) : status === "scheduled" ? (
              <ClockIcon className="size-3" />
            ) : status === "finished" ? (
              <CheckIcon className="size-3" />
            ) : null}
            {status === "scheduled" ? "Scheduled" : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          
          {status === "scheduled" && timeLeft && (
            <span className="text-xs text-muted-foreground">
              Starts in {timeLeft}
            </span>
          )}
          
          {status === "active" && timeLeft && (
            <span className="text-xs text-muted-foreground">
              Ends in {timeLeft}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <Label>
            {testTypeFormatter(data.type)}
          </Label>
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
