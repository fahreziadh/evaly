"use client"

import { useState, type KeyboardEvent, type ChangeEvent, useEffect } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
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
  placeholder = "Add tags...",
  maxTags = Number.POSITIVE_INFINITY,
  disabled = false,
  className,
}: TagsInputProps) {
  const [tags, setTags] = useState<string[]>(value || [])
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    setTags(value || [])
  }, [value])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    // Add tag on Enter or comma
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue.trim())
    }
    // Remove last tag on Backspace if input is empty
    else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < maxTags) {
      const newTags = [...tags, tag]
      setTags(newTags)
      onChange?.(newTags)
      setInputValue("")
    }
  }

  const removeTag = (index: number) => {
    if (disabled) return

    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags)
    onChange?.(newTags)
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5  select-none", className)}>
      {tags.map((tag, index) => (
        <Badge key={index} variant="outline" className="h-7 pl-3 pr-2 text-sm">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-1  hover:opacity-70  p-0.5"
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
        placeholder={tags.length < maxTags ? placeholder : ""}
        className="flex-1 font-medium min-w-[120px] px-1 h-7 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 border-0 outline-none"
        disabled={disabled || tags.length >= maxTags}
      />
    </div>
  )
}

