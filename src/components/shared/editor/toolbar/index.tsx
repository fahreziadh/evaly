import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Editor as TiptapEditor } from "@tiptap/react";
import { List, ListOrdered, Quote, Code, BoldIcon, Italic, Underline, Strikethrough } from "lucide-react";
import InsertLink from "./insert-link";
import EditorMenuTextStyle from "../editor-menu.text-style";

export const EditorToolbar = ({
  className,
  editor,
}: {
  className?: string;
  editor: TiptapEditor;
}) => {
  return (
    <div
      className={cn(
        "flex flex-row flex-wrap gap-1 items-center bg-background/90 backdrop-blur-md z-50 p-1.5 border",
        className
      )}
    >
      <EditorMenuTextStyle editor={editor} />

      <div className="border-l border-foreground/50 border-dashed h-4 mx-2"></div>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        size={"icon-sm"}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        variant={editor.isActive("bold") ? "default" : "ghost"}
        className="text-base"
        
      >
        <BoldIcon />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        size={"icon-sm"}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        variant={editor.isActive("italic") ? "default" : "ghost"}
        
        className="italic font-mono text-base"
      >
        <Italic />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        size={"icon-sm"}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        variant={editor.isActive("underline") ? "default" : "ghost"}
        
        className="font-mono  underline text-base"
      >
        <Underline />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        size={"icon-sm"}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        variant={editor.isActive("strike") ? "default" : "ghost"}
        
        className="font-mono  line-through text-base"
      >
        <Strikethrough />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        size={"icon-sm"}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        variant={editor.isActive("blockquote") ? "default" : "ghost"}
        
      >
        <Quote size={16} />
      </Button>

      <div className="border-l border-foreground/50 border-dashed h-4 mx-2"></div>

      <Button
        type="button"
        size={"icon-sm"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        
      >
        <List size={16} />
      </Button>
      <Button
        type="button"
        size={"icon-sm"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        
      >
        <ListOrdered size={16} />
      </Button>

      <div className="border-l border-foreground/50 border-dashed h-4 mx-2"></div>

      <Button
        type="button"
        size={"icon-sm"}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        variant={editor.isActive("codeBlock") ? "default" : "ghost"}

      >
        <Code size={16} />
      </Button>

      <div className="border-l border-foreground/50 border-dashed h-4 mx-2"></div>

      <InsertLink editor={editor} />
      {/* <InsertImage editor={editor} /> */}
    </div>
  );
};
