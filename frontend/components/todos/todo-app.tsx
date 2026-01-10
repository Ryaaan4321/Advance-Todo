"use client"

import { useState, useEffect } from "react"
import TodoList from "./todo-list"
import TodoForm from "./todo-form"
import TodoHeader from "./todo-header"
import type { Todo } from "@/types/todo"
import { createTodoApi } from "@/lib/todo.api"
import { useAuth } from "@/context/AuthContext"
interface TodoAppProps {
    userEmail: string
    onLogout: () => void
}
export interface TodosResponse {
    tasks: Todo[]
}
export default function TodoApp({ userEmail, onLogout }: TodoAppProps) {
    const [todos, setTodos] = useState<Todo[]>([])
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
    const { accessToken, authFetch } = useAuth();
    console.log("access Token == ", accessToken);
    const [loading, setLoading] = useState(true)
    const todoApi = createTodoApi(authFetch)
    useEffect(() => {
        if (!accessToken) return

        async function loadTodos() {
            try {
                const data = await todoApi.getAll()
                setTodos(data.tasks)
            } catch (err) {
                console.error("Unauthorized or error", err)
            } finally {
                setLoading(false)
            }
        }

        loadTodos()
    }, [accessToken])
    const addTodo = (title: string, description: string) => {
        const newTodo: Todo = {
            id: Date.now().toString(),
            title,
            description,
            status: "PENDING",
            createdAt: new Date().toISOString(),
        }
        setTodos([newTodo, ...todos])
    }

    const getTodo = (id: string) => {
        return todos.find((todo) => todo.id === id)
    }

    const updateTodo = async (id: string, updates: Partial<Todo>) => {
        const updatedTodo = await todoApi.update(id, updates)
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? updatedTodo : todo
            )
        )
    }
    const deleteTodo = async (id: string) => {
        const prevTodos = todos

        setTodos((prev) => prev.filter((t) => t.id !== id))

        try {
            await todoApi.delete(id)
        } catch {
            setTodos(prevTodos) 
        }
    }
    const toggleComplete = async (id: string) => {
        const todo = todos.find((t) => t.id === id)
        if (!todo) return

        const updated = await todoApi.toggle(id)

        setTodos((prev) =>
            prev.map((t) => (t.id === id ? updated : t))
        )
    }
    const filteredTodos = todos.filter((todo) => {
        if (filter === "active") return todo.status == "PENDING";
        if (filter === "completed") return todo.status == "COMPLETED"
        return true
    })

    const completedCount = todos.filter((t) => t.status === "COMPLETED").length
    const activeCount = todos.length - completedCount

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <TodoHeader userEmail={userEmail} onLogout={onLogout} />

            <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-2xl">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-foreground mb-2">Your Tasks</h2>
                        <p className="text-muted-foreground">
                            {activeCount === 0 && completedCount === 0
                                ? "Create your first task to get started"
                                : `${activeCount} active · ${completedCount} completed`}
                        </p>
                    </div>

                    <TodoForm onAddTodo={addTodo} />

                    {todos.length > 0 && (
                        <div className="mt-8">
                            <div className="flex gap-2 mb-6 flex-wrap">
                                {(["all", "active", "completed"] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                            }`}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <TodoList todos={filteredTodos} onToggle={toggleComplete} onDelete={deleteTodo} onUpdate={updateTodo} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
