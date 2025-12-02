import { cookies } from "next/headers"
import { getServerSession } from "next-auth/next"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateImage, generateWithReference } from "@/lib/gemini"

const generateSchema = z.object({
  prompt: z.string().min(1).max(1000),
  style: z.string().optional(),
  stylePrompt: z.string().optional(),
  referenceImage: z.string().optional(), // Base64 encoded image
  model: z.string().optional(), // API model name
})

// Free credits for guests
const GUEST_FREE_CREDITS = 3
// Free credits for registered users
const USER_FREE_CREDITS = 10
// Pro users get unlimited (we'll check subscription)

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()
    const { prompt, style, stylePrompt, referenceImage, model } = generateSchema.parse(body)

    // Get or create session ID for guest tracking
    const cookieStore = await cookies()
    let sessionId = cookieStore.get("guest_session_id")?.value
    if (!sessionId) {
      sessionId = uuidv4()
      // Note: Cookie will be set in the response
    }

    // Check credits
    let canGenerate = false
    let remainingCredits = 0

    if (session?.user) {
      // Logged in user
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          freeCredits: true,
          stripeSubscriptionId: true,
          stripeCurrentPeriodEnd: true,
        },
      })

      if (user) {
        // Check if user has active subscription (Pro)
        const isPro =
          user.stripeSubscriptionId &&
          user.stripeCurrentPeriodEnd &&
          user.stripeCurrentPeriodEnd > new Date()

        if (isPro) {
          canGenerate = true
          remainingCredits = -1 // Unlimited
        } else if (user.freeCredits > 0) {
          canGenerate = true
          remainingCredits = user.freeCredits - 1
        }
      }
    } else {
      // Guest user
      let guestSession = await db.guestSession.findUnique({
        where: { sessionId },
      })

      if (!guestSession) {
        guestSession = await db.guestSession.create({
          data: {
            sessionId,
            freeCredits: GUEST_FREE_CREDITS,
          },
        })
      }

      if (guestSession.freeCredits > 0) {
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

    // Build the full style prompt
    let fullStylePrompt = style || ""
    if (stylePrompt) {
      fullStylePrompt = fullStylePrompt
        ? `${fullStylePrompt}, ${stylePrompt}`
        : stylePrompt
    }

    // Create the generation record
    const generation = await db.imageGeneration.create({
      data: {
        userId: session?.user?.id,
        sessionId,
        prompt,
        style: fullStylePrompt || null,
        model: model || null,
        status: "generating",
      },
    })

    // Create the user message
    await db.chatMessage.create({
      data: {
        generationId: generation.id,
        role: "user",
        content: prompt,
      },
    })

    // Generate the image
    let result
    if (referenceImage) {
      result = await generateWithReference(prompt, referenceImage, fullStylePrompt, model)
    } else {
      result = await generateImage({
        prompt,
        style: fullStylePrompt,
        model,
      })
    }

    if (!result.success || !result.imageUrl) {
      // Update generation status to failed
      await db.imageGeneration.update({
        where: { id: generation.id },
        data: { status: "failed" },
      })

      return new Response(
        JSON.stringify({
          error: result.error || "Failed to generate image",
          generationId: generation.id,
        }),
        { status: 500 }
      )
    }

    // Update generation with the image URL
    await db.imageGeneration.update({
      where: { id: generation.id },
      data: {
        imageUrl: result.imageUrl,
        status: "completed",
      },
    })

    // Create the assistant message with the image
    await db.chatMessage.create({
      data: {
        generationId: generation.id,
        role: "assistant",
        content: "Here's your generated image!",
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
    } else {
      await db.guestSession.update({
        where: { sessionId },
        data: { freeCredits: { decrement: 1 } },
      })
    }

    // Create response with session cookie for guests
    const response = new Response(
      JSON.stringify({
        success: true,
        generationId: generation.id,
        imageUrl: result.imageUrl,
        remainingCredits,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    // Set cookie for guest session
    if (!session?.user) {
      response.headers.set(
        "Set-Cookie",
        `guest_session_id=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`
      )
    }

    return response
  } catch (error) {
    console.error("Generate API error:", error)

    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.issues }), {
        status: 422,
      })
    }

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    )
  }
}

// GET endpoint to check remaining credits
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("guest_session_id")?.value

    let credits = 0
    let isPro = false

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
        isPro =
          !!user.stripeSubscriptionId &&
          !!user.stripeCurrentPeriodEnd &&
          user.stripeCurrentPeriodEnd > new Date()

        credits = isPro ? -1 : user.freeCredits
      }
    } else if (sessionId) {
      const guestSession = await db.guestSession.findUnique({
        where: { sessionId },
      })
      credits = guestSession?.freeCredits ?? GUEST_FREE_CREDITS
    } else {
      credits = GUEST_FREE_CREDITS
    }

    return new Response(
      JSON.stringify({
        credits,
        isPro,
        isLoggedIn: !!session?.user,
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Get credits error:", error)
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    )
  }
}

