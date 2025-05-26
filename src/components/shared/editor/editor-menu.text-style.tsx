import { Editor } from '@tiptap/core'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { cn } from '@/lib/utils'

const EditorMenuTextStyle = ({ editor }: { editor: Editor }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size={'sm'}
          variant={'outline'}
          type="button"
          className="w-[120px] justify-between"
        >
          {editor.getAttributes('heading').level ? `Heading` : 'Text'}
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn(
            'hover:bg-foreground/10 flex w-full flex-col rounded-lg px-4 py-2 text-start',
            { 'bg-primary/20': editor.isActive('paragraph') }
          )}
        >
          <span className="text-base font-medium">Text</span>
          <span className="text-xs opacity-70">
            Just start writing with plain text.
          </span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            'hover:bg-foreground/10 flex w-full flex-col rounded-lg px-4 py-2 text-start',
            { 'bg-primary/20': editor.isActive('heading', { level: 3 }) }
          )}
        >
          <span className="text-base font-medium">Heading</span>
          <span className="text-xs opacity-70">Heading text.</span>
        </button>
      </PopoverContent>
    </Popover>
  )
}

export default EditorMenuTextStyle
