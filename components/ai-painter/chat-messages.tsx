"use client"

import * as React from "react"
import { Download, User, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  imageUrl?: string
  createdAt?: Date
}

interface ChatMessagesProps {
  messages: Message[]
  onImageClick?: (imageUrl: string) => void
}

export function ChatMessages({ messages, onImageClick }: ChatMessagesProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="rounded-full bg-primary p-4">
          <Star className="h-8 w-8 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Start Creating</h3>
          <p className="max-w-sm text-muted-foreground">
            Describe the image you want to create, and AI will generate it for you. You can also upload a reference image.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="rounded-full bg-muted px-3 py-1">A cat under the starry sky</span>
          <span className="rounded-full bg-muted px-3 py-1">Cyberpunk city night view</span>
          <span className="rounded-full bg-muted px-3 py-1">Watercolor landscape painting</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role === "assistant" && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
              <Star className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
          
          <div
            className={cn(
              "flex max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-3",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            
            {message.imageUrl && (
              <div className="group relative">
                <img
                  src={message.imageUrl}
                  alt="Generated image"
                  className="max-w-full cursor-pointer rounded-lg transition-opacity hover:opacity-90"
                  onClick={() => onImageClick?.(message.imageUrl!)}
                />
                <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadImage(
                        message.imageUrl!,
                        `ai-art-${message.id}.png`
                      )
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {message.role === "user" && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

