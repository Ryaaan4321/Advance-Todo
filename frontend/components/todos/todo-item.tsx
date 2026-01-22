"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Todo } from "@/types/todo"
interface TodoItemProps {
  todo: Todo
  expanded: boolean
  onToggleDetails: (id: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Todo>) =>void
}

export default function TodoItem({
  todo,
  expanded,
  onToggleDetails,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting,setIsDeleting]=useState(false);
  const handleSaveEdit = async () => {
    setIsSaving(true);
    if (!editTitle.trim()) return
    await onUpdate(todo.id, {
      title: editTitle,
      description: editDescription,
    })

    setIsEditing(false)
    setIsSaving(false);
  }
  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description)
    setIsEditing(false)
  }
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(todo.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className={`border border-border rounded-lg p-4 bg-card transition-all ${todo.status == "COMPLETED" ? "" : ""}`}>
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
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleSaveEdit} className={`cursor-pointer bg-blue-900 isSaving ? "hover:bg-inherit transition-none" : ""`}>
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin  rounded-full border-2 border-current border-t-transparent" />
                  Saving
                </span>
              ) : (
                "Save"
              )}
            </Button>
            <Button

              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onToggleDetails(todo.id)}
            >
              {/* {expanded ? "Hide details" : "Show details"} */}
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
                className={`font-medium text-foreground  ${todo.status == "COMPLETED" ? "line-through text-muted-foreground" : ""
                  }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={`text-sm mt-1 ${todo.status == "COMPLETED" ? "text-muted-foreground/50" : "text-muted-foreground"
                    }`}
                >
                  {todo.description}
                </p>
              )}
              {expanded && (
                <div className="mt-3 text-sm text-muted-foreground">
                  <p><strong>Description:</strong> {todo.description}</p>
                  <p><strong>Status:</strong> {todo.status}</p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(todo.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-3">
            {todo.status === "COMPLETED" ? "" :
              <Button className="cursor-pointer" variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-destructive cursor-pointer hover:text-destructive hover:bg-destructive/10"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
