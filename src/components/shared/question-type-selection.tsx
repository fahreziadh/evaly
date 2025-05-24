import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { questionTypes, type QuestionType } from "@/lib/question-type";

const QuestionTypeSelection = ({
  value,
  onValueChange,
  variant = "outline",
  className,
  readonly = false,
}: {
  value?: QuestionType | null
  onValueChange?: (value: QuestionType) => void;
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
  readonly?: boolean;
}) => {

  // Get the current selected question type or default to "multiple-choice"
  const selectedType = value && questionTypes[value] ? questionTypes[value] : questionTypes["multiple-choice"];
  
  // Ensure we have a valid icon component before trying to use it
  const SelectedIcon = selectedType?.icon || (() => null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={readonly} variant={variant} className={cn("cursor-default disabled:opacity-100", className)}>
          {SelectedIcon && <SelectedIcon size={16} className="mr-1" />}
          {selectedType?.label} 
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[240px] p-2">
        <Label className="px-2 mb-2 block">Question Type</Label>
          <div className="flex flex-col gap-1">
            {Object.values(questionTypes).map((type) => {
              // Ensure each type has an icon or use a fallback
              const TypeIcon = type.icon || (() => null);
              if (type.isHidden) return null;
              
              return (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onValueChange?.(type.value as QuestionType);
                  }}
                  size={"sm"}
                  key={type.value}
                  className="w-full justify-start gap-2"
                  variant={value === type.value ? "default" : "ghost"}
                >
                  {TypeIcon && <TypeIcon size={16} />}
                  {type.label}
                </Button>
              );
            })}
          </div>
      </PopoverContent>
    </Popover>
  );
};


export default QuestionTypeSelection;
