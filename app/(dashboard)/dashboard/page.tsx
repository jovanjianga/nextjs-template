import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { Icons } from "@/components/icons"

export const metadata = {
  title: "Dashboard",
  description: "Manage your account and subscription.",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  let subscriptionPlan
  try {
    subscriptionPlan = await getUserSubscriptionPlan(user.id)
  } catch (error) {
    // If user exists in session but not in DB, redirect to login
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to your dashboard. Manage your account and subscription."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Status
            </CardTitle>
            <Icons.user className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Your account is active and in good standing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Subscription Plan
            </CardTitle>
            <Icons.billing className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionPlan.isPro ? "Pro" : "Free"}
            </div>
            <p className="text-xs text-muted-foreground">
              {subscriptionPlan.isPro
                ? "You have access to all premium features"
                : "Upgrade to Pro for more features"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profile
            </CardTitle>
            <Icons.settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="truncate text-2xl font-bold">
              {user.name || "Not set"}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <Icons.settings className="h-6 w-6" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Account Settings
                </p>
                <p className="text-sm text-muted-foreground">
                  Update your profile information
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <Icons.billing className="h-6 w-6" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Billing
                </p>
                <p className="text-sm text-muted-foreground">
                  Manage your subscription plan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
