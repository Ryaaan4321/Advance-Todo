"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import TodoApp from "@/components/todos/todo-app"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [password,setPassword]=useState("");
  const [isLoading,setIsLoading]=useState(false);
  const [mounted, setMounted] = useState(false)
  const [error,setError]=useState("");
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!userEmail || !password) {
      setError("Please fill in all fields")
      return
    }
    setIsLoading(true)
    try {
      await login(userEmail, password)
      setUserEmail("")
      setPassword("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handlesubmit(){

  }
  const email="aryan@gmail.com"
  return (
    <div>
     <TodoApp userEmail={email} onLogout={handlesubmit}/>
    </div>
  )
}
