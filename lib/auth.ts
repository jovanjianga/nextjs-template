import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import EmailProvider from "next-auth/providers/email"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { compare } from "bcryptjs"
import { Resend } from "resend"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
import { db } from "@/lib/db"

const resend = new Resend(env.RESEND_API_KEY)

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      from: env.SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const user = await db.user.findUnique({
          where: {
            email: identifier,
          },
          select: {
            emailVerified: true,
          },
        })

        const subject = user?.emailVerified
          ? `Sign in to ${siteConfig.name}`
          : `Welcome to ${siteConfig.name}! Please verify your email`

        const { error } = await resend.emails.send({
          from: provider.from as string,
          to: identifier,
          subject,
          html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: sans-serif;">
              <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">
                ${user?.emailVerified ? `Sign in to ${siteConfig.name}` : `Welcome to ${siteConfig.name}!`}
              </h1>
              <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                ${user?.emailVerified 
                  ? "Click the button below to sign in to your account." 
                  : "Thanks for signing up! Click the button below to verify your email address."}
              </p>
              <a href="${url}" 
                 style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; 
                        text-decoration: none; border-radius: 5px; font-size: 16px;">
                ${user?.emailVerified ? "Sign In" : "Verify Email"}
              </a>
              <p style="color: #999; font-size: 14px; margin-top: 20px;">
                If you didn't request this email, you can safely ignore it.
              </p>
            </div>
          `,
        })

        if (error) {
          throw new Error(error.message)
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.hasPassword = token.hasPassword
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        hasPassword: !!dbUser.password,
      }
    },
  },
}
