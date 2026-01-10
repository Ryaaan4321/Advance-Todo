"use client"

import { useState } from "react"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

interface LoginPageProps {
  onLogin: (email: string) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignup, setIsSignup] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{isSignup ? "Create Account" : "Welcome Back"}</h1>
          <p className="text-muted-foreground text-sm">
            {isSignup ? "Join us and start organizing your tasks" : "Sign in to your account to continue"}
          </p>
        </div>

        {isSignup ? <SignupForm onSuccess={() => setIsSignup(false)} /> : <LoginForm onLogin={onLogin} />}

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
