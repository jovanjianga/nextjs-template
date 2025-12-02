import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { OnboardingForm } from "@/components/onboarding-form"

export const metadata = {
  title: "Onboarding",
  description: "Set your password to get started.",
}

export default async function OnboardingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.hasPassword) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Set your password
          </h1>
          <p className="text-sm text-muted-foreground">
            Please set a password to complete your registration
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  )
}

