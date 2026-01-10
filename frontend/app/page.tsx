"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import TodoApp from "@/components/todos/todo-app"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { TodoHeaderSkeleton } from "@/components/todoskelton/TodoHeaderSkeleton"
import { TodoFormSkeleton } from "@/components/todoskelton/TodoFormSkelton"
import { TodoListSkeleton } from "@/components/todoskelton/TodoListSkeleton"
import PatternBackground from "@/components/layouts/PatternBackground"
export default function Home() {
  const router = useRouter();
  const { accessToken, logout, user, isReady } = useAuth();
  useEffect(() => {
    if (isReady && !accessToken) {
      router.replace("/login")
    }
  }, [isReady, accessToken])
  if (!isReady) {
    return (
      <div className="min-h-screen bg-background">
        <TodoHeaderSkeleton />
        <div className="relative flex-1 overflow-hidden">
          <PatternBackground>
            <div className="max-w-2xl mx-auto px-4 py-8">
              <TodoFormSkeleton />
              <div className="mt-8">
                <TodoListSkeleton />
              </div>
            </div>
          </PatternBackground>
        </div>
      </div>
    )
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
