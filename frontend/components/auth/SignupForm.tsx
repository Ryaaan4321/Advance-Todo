"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SignupFormProps {
  onSuccess: () => void
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onSuccess()
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
    }, 600)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1 text-foreground">
          Full Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium mb-1 text-foreground">
          Email
        </label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium mb-1 text-foreground">
          Password
        </label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium mb-1 text-foreground">
          Confirm Password
        </label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full h-10">
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  )
}
