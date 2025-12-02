"use client"

import * as React from "react"
import Link from "next/link"
import { Loader2, LogIn, Settings2, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { getStylePrompt, getModelById, getDefaultModel } from "@/config/styles"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { ChatInput } from "./chat-input"
import { ChatMessages, type Message } from "./chat-messages"
import { ImagePreview } from "./image-preview"
import { ModelSelector } from "./model-selector"
import { StyleSelector } from "./style-selector"

interface AIPainterProps {
  isLoggedIn?: boolean
  userName?: string
}

export function AIPainter({ isLoggedIn = false, userName }: AIPainterProps) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [credits, setCredits] = React.useState<number>(0)
  const [isPro, setIsPro] = React.useState(false)
  const [generationId, setGenerationId] = React.useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = React.useState<string | null>(null)
  const [customStyle, setCustomStyle] = React.useState("")
  const [selectedModel, setSelectedModel] = React.useState<string>(getDefaultModel().id)
  const [previewImage, setPreviewImage] = React.useState<string | null>(null)

  // Fetch credits on mount
  React.useEffect(() => {
    fetchCredits()
  }, [])

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/generate")
      if (response.ok) {
        const data = await response.json()
        setCredits(data.credits)
        setIsPro(data.isPro)
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error)
    }
  }

  const handleSubmit = async (message: string, referenceImage?: string) => {
    if (isLoading) return

    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      createdAt: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      let response: Response
      let data: any

      if (generationId) {
        // Continue conversation with existing generation
        response = await fetch(`/api/generate/${generationId}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        })
      } else {
        // New generation
        const stylePrompt = selectedStyle ? getStylePrompt(selectedStyle) : ""
        const modelConfig = getModelById(selectedModel)
        
        response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: message,
            style: stylePrompt,
            stylePrompt: customStyle,
            referenceImage,
            model: modelConfig?.apiModel,
          }),
        })
      }

      data = await response.json()

      if (!response.ok) {
        // Show error message
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: data.message || data.error || "Generation failed, please try again",
          createdAt: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        return
      }

      // Update credits
      if (data.remainingCredits !== undefined) {
        setCredits(data.remainingCredits)
      }

      // Set generation ID for follow-up conversations
      if (data.generationId && !generationId) {
        setGenerationId(data.generationId)
      }

      // Add assistant message with image
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: generationId ? "Image updated based on your request!" : "Image generation complete!",
        imageUrl: data.imageUrl,
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Generation error:", error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Network error, please check your connection and try again",
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConversation = () => {
    setMessages([])
    setGenerationId(null)
  }

  const creditsDisplay = isPro ? (
    <span className="text-xs font-medium text-emerald-500">Pro · Unlimited</span>
  ) : credits === -1 ? (
    <span className="text-xs font-medium text-emerald-500">Pro · Unlimited</span>
  ) : (
    <span className="text-xs text-muted-foreground">
      <span className="font-medium text-foreground">{credits}</span> credits left
    </span>
  )

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border bg-card shadow-xl md:h-[700px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Star className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">AI Painter</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Model Selector */}
          <div className="hidden sm:block">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              disabled={isLoading}
            />
          </div>

          {/* Credits Display */}
          <div className="hidden md:block">{creditsDisplay}</div>

          {/* Style Settings */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>
                  Select model, style, or customize your own
                </SheetDescription>
              </SheetHeader>
              {/* Model selector for mobile */}
              <div className="mt-6 sm:hidden">
                <h4 className="mb-3 text-sm font-medium">Model</h4>
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  disabled={isLoading}
                />
              </div>
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-medium sm:hidden">Style</h4>
                <StyleSelector
                  selectedStyle={selectedStyle}
                  customStyle={customStyle}
                  onStyleChange={setSelectedStyle}
                  onCustomStyleChange={setCustomStyle}
                />
              </div>
              <div className="mt-6 space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleNewConversation}
                >
                  New Chat
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Login Button */}
          {!isLoggedIn && (
            <Button asChild size="sm" variant="default">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Log in
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <ChatMessages
        messages={messages}
        onImageClick={(url) => setPreviewImage(url)}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>AI is creating...</span>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-muted/30 p-4">
        <ChatInput
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder={
            generationId
              ? "Describe the changes you want..."
              : "Describe the image you want to create..."
          }
          disabled={!isPro && credits <= 0}
        />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="sm:hidden">{creditsDisplay}</span>
          {!isLoggedIn && (
            <Link href="/register" className="text-primary hover:underline">
              Sign up for more free credits
            </Link>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreview
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  )
}

