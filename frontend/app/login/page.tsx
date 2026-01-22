"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useEffect } from "react"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter();
    const words = ["Back", "Home", "Again", "Reality"];
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % words.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    async function handleLogin() {
        setError("")
        setIsLoading(true)
        try {
            await login(email, password)
            toast.success("Logged in")
            router.push('/')
        } catch (err: any) {
            toast.error("please check your credentials")
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
                    <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
                        Welcome Home!
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Start where you left off
                        </p>
                    </div>
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
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full h-10 sm:h-11 cursor-pointer"
                >
                    {isLoading ?
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin  rounded-full border-2 border-current border-t-transparent" />
                            Logging In
                        </span> : "Login"}
                </Button>
                <p>Already have an Account <Link href='/signup'
                    className="text-blue-900 font-semibold">
                    Signup
                </Link></p>

            </div>
        </div>
    )
}
