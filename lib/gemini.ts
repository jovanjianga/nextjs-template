import { GoogleGenAI } from "@google/genai"

import { env } from "@/env.mjs"
import { getDefaultModel } from "@/config/styles"

// Initialize the Google GenAI client only if API key is available
const ai = env.GOOGLE_AI_API_KEY
  ? new GoogleGenAI({ apiKey: env.GOOGLE_AI_API_KEY })
  : null

// Default model for image generation
const DEFAULT_IMAGE_MODEL = getDefaultModel().apiModel

export interface GenerateImageOptions {
  prompt: string
  style?: string
  model?: string // API model name
  referenceImage?: string // Base64 encoded image
  negativePrompt?: string
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4"
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  imageUrl?: string
}

export interface ImageGenerationResult {
  success: boolean
  imageUrl?: string
  text?: string
  error?: string
}

/**
 * Check if AI features are available
 */
export function isAIAvailable(): boolean {
  return !!ai
}

/**
 * Generate an image using Gemini with image generation capabilities
 */
export async function generateImage(
  options: GenerateImageOptions
): Promise<ImageGenerationResult> {
  if (!ai) {
    return {
      success: false,
      error: "AI service is not configured. Please set GOOGLE_AI_API_KEY.",
    }
  }

  const { prompt, style, model } = options
  const selectedModel = model || DEFAULT_IMAGE_MODEL
  const maxRetries = 5
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Build the full prompt with style
      let fullPrompt = prompt
      if (style) {
        fullPrompt = `${prompt}, ${style}`
      }

      const config = {
        responseModalities: ["TEXT", "IMAGE"] as ("TEXT" | "IMAGE")[],
      }

      const contents = [
        {
          role: "user" as const,
          parts: [{ text: fullPrompt }],
        },
      ]

      const response = await ai.models.generateContentStream({
        model: selectedModel,
        config,
        contents,
      })

      let imageUrl: string | undefined
      let textContent = ""

      for await (const chunk of response) {
        if (
          !chunk.candidates ||
          !chunk.candidates[0]?.content ||
          !chunk.candidates[0]?.content?.parts
        ) {
          continue
        }

        for (const part of chunk.candidates[0].content.parts) {
          if (part.inlineData) {
            const inlineData = part.inlineData
            const mimeType = inlineData.mimeType || "image/png"
            const base64Data = inlineData.data || ""
            imageUrl = `data:${mimeType};base64,${base64Data}`
          } else if (part.text) {
            textContent += part.text
          }
        }
      }

      if (imageUrl) {
        return { success: true, imageUrl, text: textContent || undefined }
      }

      return { success: false, error: "No image generated" }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.error(
        `Image generation error (attempt ${attempt}/${maxRetries}):`,
        error
      )

      // Check if it's a retryable error (500, 503, etc.)
      const errorMessage = lastError.message || ""
      const isRetryable =
        errorMessage.includes("500") ||
        errorMessage.includes("503") ||
        errorMessage.includes("INTERNAL") ||
        errorMessage.includes("temporarily unavailable")

      if (isRetryable && attempt < maxRetries) {
        // Exponential backoff with jitter: 2s, 4s, 8s, 16s, 32s + random ms
        const baseDelay = Math.pow(2, attempt) * 1000
        const jitter = Math.random() * 1000
        const waitTime = baseDelay + jitter

        console.log(`Retrying in ${Math.round(waitTime)}ms...`)
        await delay(waitTime)
        continue
      }

      // Non-retryable error or max retries reached
      break
    }
  }

  return {
    success: false,
    error:
      lastError?.message || "Failed to generate image after multiple attempts",
  }
}

/**
 * Helper function to delay execution
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Edit an existing image based on user instructions
 */
export async function editImage(
  originalImageBase64: string,
  editInstruction: string,
  chatHistory: ChatMessage[] = [],
  model?: string
): Promise<ImageGenerationResult> {
  if (!ai) {
    return {
      success: false,
      error: "AI service is not configured. Please set GOOGLE_AI_API_KEY.",
    }
  }

  const selectedModel = model || DEFAULT_IMAGE_MODEL
  const maxRetries = 5
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Clean base64 data
      const cleanBase64 = originalImageBase64.replace(
        /^data:image\/\w+;base64,/,
        ""
      )

      // Detect image mime type from base64 header or default to png
      let mimeType = "image/png"
      if (originalImageBase64.startsWith("data:image/jpeg")) {
        mimeType = "image/jpeg"
      } else if (originalImageBase64.startsWith("data:image/webp")) {
        mimeType = "image/webp"
      }

      // Build conversation history context as a text block instead of message objects
      // This avoids the "missing thought_signature" error for model responses
      const recentHistory = chatHistory.slice(-5)
      let contextPrompt = ""
      if (recentHistory.length > 0) {
        contextPrompt =
          "Context from previous conversation:\n" +
          recentHistory
            .map(
              (msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`
            )
            .join("\n") +
          "\n\n"
      }

      const config = {
        responseModalities: ["TEXT", "IMAGE"] as ("TEXT" | "IMAGE")[],
      }

      // Create the edit request with the original image
      const contents = [
        {
          role: "user" as const,
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: `${contextPrompt}Based on this image, please modify it according to these instructions: ${editInstruction}. Generate a new image with these changes.`,
            },
          ],
        },
      ]

      const response = await ai.models.generateContentStream({
        model: selectedModel,
        config,
        contents,
      })

      let imageUrl: string | undefined
      let textContent = ""

      for await (const chunk of response) {
        if (
          !chunk.candidates ||
          !chunk.candidates[0]?.content ||
          !chunk.candidates[0]?.content?.parts
        ) {
          continue
        }

        for (const part of chunk.candidates[0].content.parts) {
          if (part.inlineData) {
            const inlineData = part.inlineData
            const responseMimeType = inlineData.mimeType || "image/png"
            const base64Data = inlineData.data || ""
            imageUrl = `data:${responseMimeType};base64,${base64Data}`
          } else if (part.text) {
            textContent += part.text
          }
        }
      }

      if (imageUrl) {
        return { success: true, imageUrl, text: textContent || undefined }
      }

      return { success: false, error: "No image generated" }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.error(
        `Image edit error (attempt ${attempt}/${maxRetries}):`,
        error
      )

      // Check if it's a retryable error (500, 503, etc.)
      const errorMessage = lastError.message || ""
      const isRetryable =
        errorMessage.includes("500") ||
        errorMessage.includes("503") ||
        errorMessage.includes("INTERNAL") ||
        errorMessage.includes("temporarily unavailable")

      if (isRetryable && attempt < maxRetries) {
        // Exponential backoff with jitter: 2s, 4s, 8s, 16s, 32s + random ms
        const baseDelay = Math.pow(2, attempt) * 1000
        const jitter = Math.random() * 1000
        const waitTime = baseDelay + jitter

        console.log(`Retrying in ${Math.round(waitTime)}ms...`)
        await delay(waitTime)
        continue
      }

      // Non-retryable error or max retries reached
      break
    }
  }

  return {
    success: false,
    error: lastError?.message || "Failed to edit image after multiple attempts",
  }
}

/**
 * Generate image from text prompt with reference image
 */
export async function generateWithReference(
  prompt: string,
  referenceImageBase64: string,
  style?: string,
  model?: string
): Promise<ImageGenerationResult> {
  if (!ai) {
    return {
      success: false,
      error: "AI service is not configured. Please set GOOGLE_AI_API_KEY.",
    }
  }

  const selectedModel = model || DEFAULT_IMAGE_MODEL
  const maxRetries = 5
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let fullPrompt = prompt
      if (style) {
        fullPrompt = `${prompt}, ${style}`
      }

      // Clean base64 data
      const cleanBase64 = referenceImageBase64.replace(
        /^data:image\/\w+;base64,/,
        ""
      )

      // Detect image mime type from base64 header or default to png
      let mimeType = "image/png"
      if (referenceImageBase64.startsWith("data:image/jpeg")) {
        mimeType = "image/jpeg"
      } else if (referenceImageBase64.startsWith("data:image/webp")) {
        mimeType = "image/webp"
      }

      const config = {
        responseModalities: ["TEXT", "IMAGE"] as ("TEXT" | "IMAGE")[],
      }

      const contents = [
        {
          role: "user" as const,
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: `Using this image as a reference, create a new image based on: ${fullPrompt}`,
            },
          ],
        },
      ]

      const response = await ai.models.generateContentStream({
        model: selectedModel,
        config,
        contents,
      })

      let imageUrl: string | undefined
      let textContent = ""

      for await (const chunk of response) {
        if (
          !chunk.candidates ||
          !chunk.candidates[0]?.content ||
          !chunk.candidates[0]?.content?.parts
        ) {
          continue
        }

        for (const part of chunk.candidates[0].content.parts) {
          if (part.inlineData) {
            const inlineData = part.inlineData
            const responseMimeType = inlineData.mimeType || "image/png"
            const base64Data = inlineData.data || ""
            imageUrl = `data:${responseMimeType};base64,${base64Data}`
          } else if (part.text) {
            textContent += part.text
          }
        }
      }

      if (imageUrl) {
        return { success: true, imageUrl, text: textContent || undefined }
      }

      return { success: false, error: "No image generated" }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.error(
        `Image generation with reference error (attempt ${attempt}/${maxRetries}):`,
        error
      )

      // Check if it's a retryable error (500, 503, etc.)
      const errorMessage = lastError.message || ""
      const isRetryable =
        errorMessage.includes("500") ||
        errorMessage.includes("503") ||
        errorMessage.includes("INTERNAL") ||
        errorMessage.includes("temporarily unavailable")

      if (isRetryable && attempt < maxRetries) {
        // Exponential backoff with jitter: 2s, 4s, 8s, 16s, 32s + random ms
        const baseDelay = Math.pow(2, attempt) * 1000
        const jitter = Math.random() * 1000
        const waitTime = baseDelay + jitter

        console.log(`Retrying in ${Math.round(waitTime)}ms...`)
        await delay(waitTime)
        continue
      }

      // Non-retryable error or max retries reached
      break
    }
  }

  return {
    success: false,
    error:
      lastError?.message || "Failed to generate image after multiple attempts",
  }
}
