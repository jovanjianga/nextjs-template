import Link from "next/link"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { AIPainter } from "@/components/ai-painter"

export default async function IndexPage() {
  const session = await getServerSession(authOptions)

  return (
    <>
      {/* Hero Section with AI Painter */}
      <section className="relative overflow-hidden pb-8 pt-6 md:pb-12 md:pt-10 lg:pb-16 lg:pt-14">
        
        <div className="container flex flex-col items-center gap-8 text-center">
          <div className="space-y-4">
            <h1 className="font-heading text-3xl text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              AI Creative Studio
            </h1>
            <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-8">
              Describe your imagination, and AI will bring it to life. Featuring multiple art styles and conversational editing, create your unique masterpiece today.
            </p>
          </div>

          {/* AI Painter Component */}
          <div className="w-full max-w-4xl">
            <AIPainter
              isLoggedIn={!!session?.user}
              userName={session?.user?.name || undefined}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="container space-y-6 py-8 md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
            Powerful Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Professional image generation capabilities powered by the latest AI technology
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-xl border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-lg p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-primary"
              >
                <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313-12.454z" />
                <path d="m17 4 2 2" />
                <path d="m19 4 2 2" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">AI Image Generation</h3>
                <p className="text-sm text-muted-foreground">
                  High quality, high resolution images powered by Google Imagen 3
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-lg p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-primary"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Conversational Creation</h3>
                <p className="text-sm text-muted-foreground">
                  Chat-like interaction to describe needs and refine results through multi-turn dialogue
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-lg p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-primary"
              >
                <circle cx="13.5" cy="6.5" r=".5" />
                <circle cx="17.5" cy="10.5" r=".5" />
                <circle cx="8.5" cy="7.5" r=".5" />
                <circle cx="6.5" cy="12.5" r=".5" />
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Multiple Art Styles</h3>
                <p className="text-sm text-muted-foreground">
                  12+ preset styles: Realistic, Anime, Oil Painting, Watercolor, Cyberpunk, etc.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-lg p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-primary"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Reference Image Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload reference images to guide AI in generating stylized creations based on your input
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-lg p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-primary"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Secure & Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security ensuring your creative data is safely stored
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-lg p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-primary"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Free Trial</h3>
                <p className="text-sm text-muted-foreground">
                  3 free credits for guests, 10 upon registration. Unlimited access for Pro members.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
            Start Your Creative Journey
          </h2>
          <p className="max-w-[85%] leading-normal opacity-90 sm:text-lg sm:leading-7">
            Register now to get 10 free credits. Unlock Pro for unlimited creative freedom.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-black hover:bg-white/90"
              )}
            >
              Sign Up Free
            </Link>
            <Link
              href="/pricing"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white text-white hover:bg-white/10"
              )}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
