import { Editor as TiptapEditor } from '@tiptap/react'
import {
  BoldIcon,
  Code,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline
} from 'lucide-react'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

import EditorMenuTextStyle from '../editor-menu.text-style'
import InsertLink from './insert-link'

export const EditorToolbar = ({
  className,
  editor
}: {
  className?: string
  editor: TiptapEditor
}) => {
  return (
    <div
      className={cn(
        'bg-background/90 z-50 flex flex-row flex-wrap items-center gap-1 border p-1.5 backdrop-blur-md',
        className
      )}
    >
      <EditorMenuTextStyle editor={editor} />

      <div className="border-foreground/50 mx-2 h-4 border-l border-dashed"></div>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        size={'icon-sm'}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        className="text-base"
      >
        <BoldIcon />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        size={'icon-sm'}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        className="font-mono text-base italic"
      >
        <Italic />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        size={'icon-sm'}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        variant={editor.isActive('underline') ? 'default' : 'ghost'}
        className="font-mono text-base underline"
      >
        <Underline />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        size={'icon-sm'}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        variant={editor.isActive('strike') ? 'default' : 'ghost'}
        className="font-mono text-base line-through"
      >
        <Strikethrough />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        size={'icon-sm'}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
      >
        <Quote size={16} />
      </Button>

      <div className="border-foreground/50 mx-2 h-4 border-l border-dashed"></div>

      <Button
        type="button"
        size={'icon-sm'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
      >
        <List size={16} />
      </Button>
      <Button
        type="button"
        size={'icon-sm'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
      >
        <ListOrdered size={16} />
      </Button>

      <div className="border-foreground/50 mx-2 h-4 border-l border-dashed"></div>

      <Button
        type="button"
        size={'icon-sm'}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
      >
        <Code size={16} />
      </Button>

      <div className="border-foreground/50 mx-2 h-4 border-l border-dashed"></div>

      <InsertLink editor={editor} />
      {/* <InsertImage editor={editor} /> */}
    </div>
  )
}
