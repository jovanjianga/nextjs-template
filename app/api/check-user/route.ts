import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import * as z from "zod"

const schema = z.object({
  email: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = schema.parse(body)

    const user = await db.user.findUnique({
      where: { email },
      select: { password: true },
    })

    return NextResponse.json({
      hasPassword: !!user?.password,
      exists: !!user,
    })
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }
}

