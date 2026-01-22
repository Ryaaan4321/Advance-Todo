"use client"

import { useState, useEffect } from "react"
import TodoList from "./todo-list"
import TodoForm from "./todo-form"
import TodoHeader from "./todo-header"
import type { Todo } from "@/types/todo"
import { createTodoApi } from "@/lib/todo.api"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import PatternBackground from "../layouts/PatternBackground"
import { RevolvingDot } from "react-loader-spinner"
import ElegantLoader from "../Loader"
interface TodoAppProps {
    onLogout: () => void
}
export interface TodosResponse {
    tasks: Todo[]
}
export default function TodoApp({ onLogout }: TodoAppProps) {
    const [todos, setTodos] = useState<Todo[]>([])
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
    const { accessToken, authFetch } = useAuth();
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [createLoading, setCreateLoading] = useState(false);
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
    const handleToggleDetails = (id: string) => {
        setExpandedId((prev) => (prev === id ? null : id))
    }
    const addTodo = async (title: string, description: string) => {
        try {
            setCreateLoading(true);
            const createdTodo = await todoApi.create(title, description)
            toast.success("Task Created", {
                description: createdTodo.title
            })
            setTodos((prev) => [createdTodo, ...prev])
            setCreateLoading(false);
        } catch (err) {
            console.error("Failed to create todo", err)
        }
    }
    const getTodo = (id: string) => {
        return todos.find((todo) => todo.id === id)
    }
    const updateTodo = async (id: string, updates: Partial<Todo>) => {
        const updatedTodo = await todoApi.update(id, updates)
        toast.success("Task Updated Succesfully")
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? updatedTodo : todo
            )
        )
    }
    const deleteTodo = async (id: string) => {
        try {
            await todoApi.delete(id)
            setTodos((prev) => prev.filter((t) => t.id !== id))
            toast.success("Task deleted successfully")
        } catch (err) {
            console.error(err)
            toast.error("Failed to delete task")
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
    const filterStyles = {
        all: "bg-secondary text-secondary-foreground",
        active: "bg-blue-600 text-white",
        completed: "bg-green-600 text-white",
    }
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <TodoHeader onLogout={onLogout} />
            <PatternBackground>
                {createLoading == true ?
                    <ElegantLoader></ElegantLoader>
                    : <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
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
                                        {(["all", "active", "completed"] as const).map((f) => {
                                            const isActive = filter === f

                                            return (
                                                <button
                                                    key={f}
                                                    onClick={() => setFilter(f)}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200
        ${isActive
                                                            ? `${filterStyles[f]}  scale-105`
                                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                                        }
      `}
                                                >
                                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                                </button>
                                            )
                                        })}

                                    </div>

                                    <TodoList
                                        expandedId={expandedId}
                                        onToggleDetails={handleToggleDetails}
                                        todos={filteredTodos}
                                        onToggle={toggleComplete}
                                        onDelete={deleteTodo}
                                        onUpdate={updateTodo} />
                                </div>
                            )}
                        </div>
                    </div>}
            </PatternBackground>
        </div>
    )
}
