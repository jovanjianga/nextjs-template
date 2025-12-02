"use client"

import * as React from "react"
import { ImagePlus, Loader2, Send, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps {
  onSubmit: (message: string, image?: string) => void
  isLoading: boolean
  placeholder?: string
  disabled?: boolean
}

export function ChatInput({
  onSubmit,
  isLoading,
  placeholder = "Describe the image you want to create...",
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = React.useState("")
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (!message.trim() && !uploadedImage) return
    if (isLoading || disabled) return

    onSubmit(message.trim(), uploadedImage || undefined)
    setMessage("")
    setUploadedImage(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setUploadedImage(data.imageUrl)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
  }

  return (
    <div className="relative flex flex-col rounded-3xl border bg-background shadow-sm transition-all focus-within:ring-1 focus-within:ring-ring">
      {/* Uploaded Image Preview */}
      {uploadedImage && (
        <div className="w-full p-4 pb-0">
          <div className="relative inline-block">
            <div className="overflow-hidden rounded-xl border border-border/50">
              <img
                src={uploadedImage}
                alt="Uploaded reference"
                className="h-20 w-auto object-cover"
              />
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full shadow-md"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-end gap-2 p-3">
        {/* File Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isUploading || disabled}
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImagePlus className="h-5 w-5" />
          )}
        </Button>

        {/* Text Input */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading || disabled}
          className={cn(
            "min-h-[44px] max-h-[200px] flex-1 resize-none border-0 bg-transparent p-3 text-base shadow-none focus-visible:ring-0",
            "placeholder:text-muted-foreground/70",
            "scrollbar-thin scrollbar-thumb-muted"
          )}
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = "auto"
            target.style.height = `${target.scrollHeight}px`
          }}
        />

        {/* Submit Button */}
        <Button
          size="icon"
          className={cn(
            "h-10 w-10 shrink-0 rounded-full transition-all",
            message.trim() || uploadedImage
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground hover:bg-muted"
          )}
          onClick={handleSubmit}
          disabled={isLoading || disabled || (!message.trim() && !uploadedImage)}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  )
}

