import { cookies } from "next/headers"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { editImage } from "@/lib/gemini"

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
})

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
})

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)
    const session = await getServerSession(authOptions)
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("guest_session_id")?.value

    // Find the generation
    const generation = await db.imageGeneration.findUnique({
      where: { id: params.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!generation) {
      return new Response(JSON.stringify({ error: "Generation not found" }), {
        status: 404,
      })
    }

    // Verify ownership
    if (session?.user) {
      if (generation.userId !== session.user.id) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 403,
        })
      }
    } else {
      if (generation.sessionId !== sessionId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 403,
        })
      }
    }

    // Check credits
    let canGenerate = false
    let remainingCredits = 0

    if (session?.user) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          freeCredits: true,
          stripeSubscriptionId: true,
          stripeCurrentPeriodEnd: true,
        },
      })

      if (user) {
        const isPro =
          user.stripeSubscriptionId &&
          user.stripeCurrentPeriodEnd &&
          user.stripeCurrentPeriodEnd > new Date()

        if (isPro) {
          canGenerate = true
          remainingCredits = -1
        } else if (user.freeCredits > 0) {
          canGenerate = true
          remainingCredits = user.freeCredits - 1
        }
      }
    } else if (sessionId) {
      const guestSession = await db.guestSession.findUnique({
        where: { sessionId },
      })

      if (guestSession && guestSession.freeCredits > 0) {
        canGenerate = true
        remainingCredits = guestSession.freeCredits - 1
      }
    }

    if (!canGenerate) {
      return new Response(
        JSON.stringify({
          error: "No credits remaining",
          message: session?.user
            ? "Please upgrade to Pro for unlimited generations"
            : "Please sign in for more free credits",
        }),
        { status: 403 }
      )
    }

    const body = await req.json()
    const { message } = chatSchema.parse(body)

    // Get the last image from the conversation
    const lastImageMessage = [...generation.messages]
      .reverse()
      .find((m) => m.imageUrl)

    if (!lastImageMessage?.imageUrl) {
      return new Response(
        JSON.stringify({ error: "No image found in conversation" }),
        { status: 400 }
      )
    }

    // Create user message
    await db.chatMessage.create({
      data: {
        generationId: generation.id,
        role: "user",
        content: message,
      },
    })

    // Update generation status
    await db.imageGeneration.update({
      where: { id: generation.id },
      data: { status: "generating" },
    })

    // Build chat history for context
    const chatHistory = generation.messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
      imageUrl: m.imageUrl || undefined,
    }))

    // Edit the image based on the message (use the same model as the original generation)
    const result = await editImage(
      lastImageMessage.imageUrl,
      message,
      chatHistory,
      generation.model || undefined
    )

    if (!result.success || !result.imageUrl) {
      await db.imageGeneration.update({
        where: { id: generation.id },
        data: { status: "failed" },
      })

      return new Response(
        JSON.stringify({
          error: result.error || "Failed to edit image",
        }),
        { status: 500 }
      )
    }

    // Update generation with new image
    await db.imageGeneration.update({
      where: { id: generation.id },
      data: {
        imageUrl: result.imageUrl,
        status: "completed",
      },
    })

    // Create assistant message with new image
    const assistantMessage = await db.chatMessage.create({
      data: {
        generationId: generation.id,
        role: "assistant",
        content: "Here's your updated image!",
        imageUrl: result.imageUrl,
      },
    })

    // Deduct credits
    if (session?.user) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { stripeSubscriptionId: true, stripeCurrentPeriodEnd: true },
      })

      const isPro =
        user?.stripeSubscriptionId &&
        user?.stripeCurrentPeriodEnd &&
        user.stripeCurrentPeriodEnd > new Date()

      if (!isPro) {
        await db.user.update({
          where: { id: session.user.id },
          data: { freeCredits: { decrement: 1 } },
        })
      }
    } else if (sessionId) {
      await db.guestSession.update({
        where: { sessionId },
        data: { freeCredits: { decrement: 1 } },
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: assistantMessage,
        imageUrl: result.imageUrl,
        remainingCredits,
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Chat API error:", error)

    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.issues }), {
        status: 422,
      })
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    })
  }
}

// GET endpoint to fetch conversation history
export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)
    const session = await getServerSession(authOptions)
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("guest_session_id")?.value

    const generation = await db.imageGeneration.findUnique({
      where: { id: params.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!generation) {
      return new Response(JSON.stringify({ error: "Generation not found" }), {
        status: 404,
      })
    }

    // Verify ownership
    if (session?.user) {
      if (generation.userId !== session.user.id) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 403,
        })
      }
    } else {
      if (generation.sessionId !== sessionId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 403,
        })
      }
    }

    return new Response(
      JSON.stringify({
        generation,
        messages: generation.messages,
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Get chat history error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    })
  }
}
