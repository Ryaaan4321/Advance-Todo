"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
interface LoginFormProps {
    onLogin: (email: string, password: string) => Promise<void>
}
export default function LoginForm({ onLogin }: LoginFormProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth();
    async function handleLogin() {
        setError("")
        setIsLoading(true)
        try {
            await login(email, password)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground">
                    Email
                </label>
                <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1 text-foreground">
                    Password
                </label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full"
                />
            </div>
            {error && (
                <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-md border border-destructive/20">
                    {error}
                </div>
            )}
            <Button
                onClick={handleLogin}
                disabled={isLoading} className="w-full h-10">
                {isLoading ? "Signing in..." : "Sign In"}
            </Button>
        </div>
    )
}
