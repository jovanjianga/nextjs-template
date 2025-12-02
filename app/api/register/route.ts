import { db } from "@/lib/db"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import * as z from "zod"

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = userSchema.parse(body)

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(password, 10)

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ user: newUser, message: "User created successfully" }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ message: error.issues[0].message }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

