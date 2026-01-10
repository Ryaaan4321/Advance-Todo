"use client"

import TodoItem from "./todo-item"
import type { Todo } from "@/types/todo"

interface TodoListProps {
  todos: Todo[]
  expandedId: string | null
  onToggleDetails: (id: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Todo>) => void
}


export default function TodoList({ todos, onToggle, onDelete, onUpdate,onToggleDetails,expandedId }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks yet. Create one to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          expanded={expandedId === todo.id} 
          onToggleDetails={onToggleDetails}
        />
      ))}
    </div>
  )
}
