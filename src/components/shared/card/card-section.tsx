import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { DataModel } from "convex/_generated/dataModel";

const CardSection = ({
  data,
  isSelected,
  onClick,
}: {
  data?: DataModel["testSection"]["document"] & { numOfQuestions: number };
  onClick?: () => void;
  isSelected?: boolean;
}) => {
  if (!data) return null;
  return (
    <Card
      key={data._id}
      onClick={onClick}
      className={cn(
        "flex border-none flex-col group/section justify-start  cursor-pointer p-3 relative select-none bg-card",
        isSelected ? "bg-foreground text-background" : "hover:bg-secondary"
      )}
    >
      {isSelected ? (
        <div className="absolute top-2 right-2">
          <CheckIcon size={16} />
        </div>
      ) : null}
      <span className="text-sm font-medium">
        {data.order}. {data.title || `Section ${data.order}`}
      </span>
      <div className="text-xs mt-1 flex flex-row gap-3 flex-wrap">
        {/* {data.duration ? (
          <span className="flex flex-row gap-1 items-center">
            <ClockIcon size={14} />{" "}
            {Math.floor(data.duration / 60) > 0
              ? `${Math.floor(data.duration / 60)}h `
              : ""}
            {data.duration % 60}m
          </span>
        ) : (
          <span className="flex flex-row gap-1 items-center">
            <ClockIcon size={14} />
            0m
          </span>
        )} */}
        <span className="border px-2 py-0.5 rounded-full">
          {JSON.stringify(data.numOfQuestions)} Questions
        </span>
      </div>
    </Card>
  );
};

export default CardSection;
