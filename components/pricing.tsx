"use client"

import * as React from "react"
import { Check, Rocket, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Pricing() {
  const [isYearly, setIsYearly] = React.useState(false)

  return (
    <section className="container py-8 md:py-12 lg:py-24" id="pricing">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-6 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Pricing
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Choose the plan that best suits your needs.
        </p>
      </div>

      {/* Custom Toggle Switch */}
      <div className="mt-8 flex items-center justify-center">
        <div className="relative flex items-center rounded-full border bg-muted p-1">
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "z-10 rounded-full px-8 py-2 text-sm font-medium transition-all",
              !isYearly 
                ? "bg-foreground text-background shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "z-10 rounded-full px-8 py-2 text-sm font-medium transition-all",
              isYearly 
                ? "bg-foreground text-background shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly
          </button>

          {/* Floating Badge */}
          <div className="absolute -right-2 -top-6 animate-float-color rounded-full px-3 py-1 text-[10px] font-bold tracking-wide">
            ✨ 33% OFF
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2">
        {/* Free Plan */}
        <div className="relative flex flex-col justify-between rounded-[2rem] border bg-background p-8 shadow-sm transition-shadow hover:shadow-md xl:p-10">
          <div>
            <div className="flex items-center justify-between gap-x-4">
              <h3 className="text-2xl font-bold leading-8 text-foreground">Free</h3>
              <Star className="h-6 w-6 text-foreground/50" />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Try out the AI painting capabilities
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-sm font-semibold leading-6 text-foreground">Always Free</span>
            </p>
            <p className="mt-2 flex items-baseline gap-x-1">
              <span className="text-5xl font-bold tracking-tight text-foreground">$0</span>
            </p>
            <ul role="list" className="mt-8 space-y-4 text-sm leading-6 text-muted-foreground">
              <li className="flex gap-x-3">
                <Check className="h-5 w-5 flex-none text-foreground" />
                10 free credits upon registration
              </li>
              <li className="flex gap-x-3">
                <Check className="h-5 w-5 flex-none text-foreground" />
                3 daily free credits
              </li>
              <li className="flex gap-x-3">
                <Check className="h-5 w-5 flex-none text-foreground" />
                Standard resolution images
              </li>
              <li className="flex gap-x-3">
                <Check className="h-5 w-5 flex-none text-foreground" />
                Access to basic AI models
              </li>
            </ul>
          </div>
          <Button variant="outline" className="mt-8 w-full rounded-full py-6 text-base font-medium" disabled>
            Current Plan
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="relative flex flex-col justify-between rounded-[2rem] border bg-background p-8 shadow-2xl transition-transform hover:-translate-y-1 xl:p-10">
          {/* Recommended Badge */}
          <div className="absolute -top-5 right-8">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1.5 text-sm font-medium text-white shadow-lg">
              Recommended
            </span>
          </div>
          
          <div>
            <div className="flex items-center justify-between gap-x-4">
              <h3 className="text-2xl font-bold leading-8 text-foreground">Pro</h3>
              <Rocket className="h-6 w-6 text-foreground" />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Unlock the full potential of AI creation
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-5xl font-bold tracking-tight text-foreground">
                ${isYearly ? "9.99" : "14.99"}
              </span>
              <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
            </p>
            <ul role="list" className="mt-8 space-y-4 text-sm leading-6 text-foreground">
              <li className="flex gap-x-3">
                <Check className="h-5 w-5 flex-none text-foreground" />
                <strong>Unlimited</strong> image generations
              </li>
              <li className="flex gap-x-3">
                <Check className="h-5 w-5 flex-none text-foreground" />
                High definition (HD) upscaling
              </li>
              <li className="flex gap-x-3">
                <Check className="h-5 w-5 flex-none text-foreground" />
                Access to <strong>all premium models</strong>
              </li>
              <li className="flex gap-x-3">
                <Check className="h-5 w-5 flex-none text-foreground" />
                Commercial usage rights
              </li>
              <li className="flex gap-x-3">
                <Check className="h-5 w-5 flex-none text-foreground" />
                Priority processing speed
              </li>
            </ul>
          </div>
          <Button className="mt-8 w-full rounded-full bg-primary py-6 text-base font-medium text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl">
            Upgrade Now
            <span className="ml-2">→</span>
          </Button>
        </div>
      </div>
    </section>
  )
}

