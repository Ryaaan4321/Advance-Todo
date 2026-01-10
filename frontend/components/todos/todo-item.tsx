"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Todo } from "@/types/todo"
import { createTodoApi } from "@/lib/todo.api"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Todo>) => void
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description)
  const { accessToken,authFetch } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const todoApi=createTodoApi(authFetch);
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

  if (!accessToken) {
    router.push('/login')
  }

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return
    onUpdate(todo.id, {
      title: editTitle,
      description: editDescription,
    })

    setIsEditing(false)
  }
  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description)
    setIsEditing(false)
  }
  return (
    <div className={`border border-border rounded-lg p-4 bg-card transition-all ${todo.status == "COMPLETED" ? "opacity-60" : ""}`}>
      {isEditing ? (
        <div className="space-y-3">
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="text-base font-medium"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
            rows={2}
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleSaveEdit}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={todo.status == "COMPLETED"}
              onChange={() => onToggle(todo.id)}
              className="mt-1 w-5 h-5 rounded border-border cursor-pointer accent-primary"
            />
            <div className="flex-1 min-w-0">
              <h3
                className={`font-medium text-foreground break-words ${todo.status == "COMPLETED" ? "line-through text-muted-foreground" : ""
                  }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={`text-sm mt-1 break-words ${todo.status == "COMPLETED" ? "text-muted-foreground/50" : "text-muted-foreground"
                    }`}
                >
                  {todo.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onDelete(todo.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
