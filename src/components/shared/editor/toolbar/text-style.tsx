import { cn } from '@/lib/utils'
import { Editor } from '@tiptap/core'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const TextStyle = ({ editor }: { editor: Editor }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size={'sm'}
          variant={'ghost'}
          className="w-[100px] justify-between px-2"
        >
          {editor.getAttributes('heading').level
            ? `Heading ${editor.getAttributes('heading').level}`
            : 'Text'}
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn(
            'hover:bg-foreground/5 flex w-full flex-col rounded-lg px-4 py-2 text-start',
            { 'bg-primary/5': editor.isActive('paragraph') }
          )}
        >
          <span className="text-base font-medium">Text</span>
          <span className="text-xs opacity-70">
            Just start writing with plain text.
          </span>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            'hover:bg-foreground/5 flex w-full flex-col rounded-lg px-4 py-2 text-start',
            { 'bg-primary/5': editor.isActive('heading', { level: 1 }) }
          )}
        >
          <span className="text-base font-medium">Heading 1</span>
          <span className="text-xs opacity-70">Big section heading.</span>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            'hover:bg-foreground/5 flex w-full flex-col rounded-lg px-4 py-2 text-start',
            { 'bg-primary/5': editor.isActive('heading', { level: 2 }) }
          )}
        >
          <span className="text-base font-medium">Heading 2</span>
          <span className="text-xs opacity-70">Medium section heading.</span>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            'hover:bg-foreground/5 flex w-full flex-col rounded-lg px-4 py-2 text-start',
            { 'bg-primary/5': editor.isActive('heading', { level: 3 }) }
          )}
        >
          <span className="text-base font-medium">Heading 3</span>
          <span className="text-xs opacity-70">Small section heading.</span>
        </button>
      </PopoverContent>
    </Popover>
  )
}

export default TextStyle
