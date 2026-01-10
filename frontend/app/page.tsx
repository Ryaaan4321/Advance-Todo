"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import TodoApp from "@/components/todos/todo-app"
import { useRouter } from "next/navigation"
import { todo } from "node:test"
import { toast } from "sonner"
export default function Home() {
  const router = useRouter();
  const { accessToken, logout, user, isReady } = useAuth();
  useEffect(() => {
    if (isReady && !accessToken) {
      router.replace("/login")
    }
  }, [isReady, accessToken])
  if (!isReady) {
    return <div>Loading...</div>
  }
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
