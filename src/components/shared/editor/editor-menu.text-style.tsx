import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/core";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const EditorMenuTextStyle = ({ editor }: { editor: Editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size={"sm"}
          variant={"outline"}
          type="button"
          className="justify-between w-[120px]"
        >
          {editor.getAttributes("heading").level
            ? `Heading`
            : "Text"}
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn(
            "w-full hover:bg-foreground/10 px-4 py-2 text-start flex flex-col rounded-lg",
            { "bg-primary/20": editor.isActive("paragraph") }
          )}
        >
          <span className="font-medium text-base">Text</span>
          <span className="opacity-70 text-xs">
            Just start writing with plain text.
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            "w-full hover:bg-foreground/10 px-4 py-2 text-start flex flex-col rounded-lg",
            { "bg-primary/20": editor.isActive("heading", { level: 3 }) }
          )}
        >
          <span className="font-medium text-base">Heading</span>
          <span className="opacity-70 text-xs">Heading text.</span>
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default EditorMenuTextStyle;
