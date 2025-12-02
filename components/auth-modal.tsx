"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserAuthForm } from "@/components/user-auth-form"
import { Button } from "@/components/ui/button"

interface AuthModalProps {
  children: React.ReactNode
}

export function AuthModal({ children }: AuthModalProps) {
  const [isLogin, setIsLogin] = React.useState(true)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {isLogin ? "Log in to AI Painter" : "Create an account"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 p-4">
          <UserAuthForm type={isLogin ? "login" : "register"} />
          <div className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="p-0 text-primary underline-offset-4"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Log in"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
