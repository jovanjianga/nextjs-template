import { NextRequest } from "next/server"

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

// Allowed MIME types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({
          error: "Invalid file type",
          message: "Only JPEG, PNG, WebP, and GIF images are allowed",
        }),
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({
          error: "File too large",
          message: "Maximum file size is 10MB",
        }),
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: dataUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Upload error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to upload file" }),
      { status: 500 }
    )
  }
}

