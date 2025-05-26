'use client'

import { X } from 'lucide-react'
import { type ChangeEvent, type KeyboardEvent, useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'

interface TagsInputProps {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  disabled?: boolean
  className?: string
}

export default function TagsInput({
  value,
  onChange,
  placeholder = 'Add tags...',
  maxTags = Number.POSITIVE_INFINITY,
  disabled = false,
  className
}: TagsInputProps) {
  const [tags, setTags] = useState<string[]>(value || [])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setTags(value || [])
  }, [value])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    // Add tag on Enter or comma
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue.trim())
    }
    // Remove last tag on Backspace if input is empty
    else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < maxTags) {
      const newTags = [...tags, tag]
      setTags(newTags)
      onChange?.(newTags)
      setInputValue('')
    }
  }

  const removeTag = (index: number) => {
    if (disabled) return

    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags)
    onChange?.(newTags)
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5 select-none', className)}>
      {tags.map((tag, index) => (
        <Badge key={index} variant="outline" className="h-7 pr-2 pl-3 text-sm">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-1 p-0.5 hover:opacity-70"
            disabled={disabled}
            aria-label={`Remove ${tag}`}
          >
            <X className="size-3 stroke-3" />
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length < maxTags ? placeholder : ''}
        className="h-7 min-w-[120px] flex-1 border-0 px-1 text-sm font-medium outline-none focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={disabled || tags.length >= maxTags}
      />
    </div>
  )
}
