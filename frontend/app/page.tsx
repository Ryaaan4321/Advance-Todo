"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import TodoApp from "@/components/todos/todo-app"
import { useRouter } from "next/navigation"
import { todo } from "node:test"
import { toast } from "sonner"
export default function Home() {
  const router = useRouter();
  const { accessToken, logout, user } = useAuth();
  useEffect(() => {
    if (!accessToken) {
      router.replace("/login")
    }
  }, [accessToken])
  function handleLogout() {
    logout();
    toast.success("Logged Out!")
    router.replace("/login")
  }
  return (
    <div>
      <TodoApp onLogout={handleLogout} />
    </div>
  )
}
