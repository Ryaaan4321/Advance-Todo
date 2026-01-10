"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"

interface AuthContextType {
    accessToken: string | null
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}
const AuthContext = createContext<AuthContextType | null>(null)
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    useEffect(() => {
        refreshAccessToken();
    }, [])
    async function refreshAccessToken() {
        try {
            const data = await apiFetch("/auth/refresh", {
                method: "POST",
            })
            setAccessToken(data.accessToken)
        } catch {
            setAccessToken(null)
        }
    }
    async function login(email: string, password: string) {
        console.log("login got callleddd from auth context");
        const data = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        })

        setAccessToken(data.accessToken)
    }
    async function logout() {
        await apiFetch("/auth/logout", { method: "POST" })
        setAccessToken(null)
    }
    return (
        <AuthContext.Provider value={{ accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
    return ctx
}