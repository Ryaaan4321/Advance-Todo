"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { signup } = useAuth()
    const router=useRouter();
    async function handleSignup() {
        setError("")
        setIsLoading(true)
        try {
            await signup(email, password)
            router.push('/')
        } catch (err: any) {
            setError(err.message || "Something went wrong")
        } finally {
            setEmail("");
            setPassword("");
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center px-4 sm:px-6">
            <div className="w-full max-w-sm sm:max-w-md space-y-5 sm:space-y-6">
                <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-4xl font-semibold">
                        Welcome 
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Let's Start From the Start
                    </p>
                </div>
                <div className="space-y-1">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground"
                    >
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-1">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-foreground"
                    >
                        Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-md border border-destructive/20">
                        {error}
                    </div>
                )}
                <Button
                    onClick={handleSignup}
                    disabled={isLoading}
                    className="w-full h-10 sm:h-11"
                >
                    {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
                <p>Already have an Account <Link href='/login'
                    className="text-blue-900 font-semibold">
                    Signin
                </Link></p>

            </div>
        </div>
    )
}
