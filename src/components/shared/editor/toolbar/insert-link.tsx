import { Editor } from '@tiptap/core'
import { Link } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const InsertLink = ({ editor }: { editor: Editor }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      const { from, to } = editor.state.selection
      const selectedText = editor.state.doc.textBetween(from, to)

      if (selectedText) {
        setText(selectedText)
      }

      if (editor.isActive('link')) {
        const attrs = editor.getAttributes('link')
        setUrl(attrs.href || '')
      } else {
        setUrl('')
      }
    }
  }, [isOpen, editor])

  const validateUrl = (url: string) => {
    try {
      // Allow relative paths
      if (url.startsWith('/')) return true

      // Check if it's a valid URL
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate URL
    if (!url) {
      setError('Please enter a URL')
      return
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL')
      return
    }

    // Normalize URL (add https if protocol is missing)
    let normalizedUrl = url
    if (!url.startsWith('/') && !url.match(/^[a-zA-Z]+:\/\//)) {
      normalizedUrl = `https://${url}`
    }

    if (editor.isActive('link')) {
      const currentText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      )

      if (text && text !== currentText) {
        editor
          .chain()
          .focus()
          .deleteSelection()
          .insertContent(text)
          .setTextSelection({
            from: editor.state.selection.from - text.length,
            to: editor.state.selection.from
          })
          .run()
      }
      editor.chain().focus().setLink({ href: normalizedUrl }).run()
    } else if (!editor.state.selection.empty) {
      editor.chain().focus().setLink({ href: normalizedUrl }).run()
    } else if (text) {
      editor
        .chain()
        .focus()
        .insertContent(text)
        .setTextSelection({
          from: editor.state.selection.from - text.length,
          to: editor.state.selection.from
        })
        .setLink({ href: normalizedUrl })
        .run()
    }

    setText('')
    setUrl('')
    setError('')
    setIsOpen(false)
  }

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run()
    setText('')
    setUrl('')
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size={'icon-sm'}
          variant={editor.isActive('link') ? 'secondary' : 'ghost'}
        >
          <Link size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit}>
          <Label>Text</Label>
          <Input
            placeholder="Insert text"
            className="mt-2 mb-4"
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={!editor.state.selection.empty && !editor.isActive('link')}
          />

          <Label>Link</Label>
          <Input
            placeholder="Insert link"
            value={url}
            onChange={e => {
              setUrl(e.target.value)
              setError('') // Clear error when user types
            }}
            className={error ? 'border-red-500' : ''}
          />
          {error && <span className="mt-1 text-sm text-red-500">{error}</span>}

          <div className="mt-4 flex gap-2">
            <Button type="submit" className="flex-1">
              {editor.isActive('link') ? 'Update Link' : 'Insert Link'}
            </Button>

            {editor.isActive('link') && (
              <Button type="button" variant={'destructive'} onClick={handleRemoveLink}>
                Remove
              </Button>
            )}
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}

export default InsertLink
