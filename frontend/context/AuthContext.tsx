"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"

interface AuthContextType {
    accessToken: string | null
    login: (email: string, password: string) => Promise<void>
    signup: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    user: { email: string } | null
    isReady:boolean
    authFetch: <T = any>(
        url: string,
        options?: RequestInit
    ) => Promise<T>
}
const AuthContext = createContext<AuthContextType | null>(null)
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [user, setUser] = useState<{ email: string } | null>(null)
    const [isReady, setIsReady] = useState(false)
    useEffect(() => {
        refreshAccessToken().finally(() => setIsReady(true))
    }, [])
    async function refreshAccessToken() {
        try {
            const data = await apiFetch("/auth/refresh", { method: "POST" })
            setAccessToken(data.accessToken)
            setUser(data.user)
        } catch {
            setAccessToken(null)
        }
    }
    async function login(email: string, password: string) {
        const data = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        })
        setAccessToken(data.accessToken)
        setUser(data.user)
    }
    async function signup(email: string, password: string) {
        const data = await apiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        })
        setAccessToken(data.accessToken)
    }
    async function logout() {
        await apiFetch("/auth/logout", { method: "POST" })
        setAccessToken(null)
    }
    async function authFetch<T = any>(
        url: string,
        options: RequestInit = {}
    ): Promise<T> {
        if (!accessToken) {
            throw new Error("NOT_AUTHENTICATED")
        }
        return apiFetch(url, options, accessToken)
    }
    return (
        <AuthContext.Provider
            value={{ accessToken, login, signup, logout, user,isReady, authFetch }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
    return ctx
}