import { TodoItemSkeleton } from "./TodoItemSkeleton"

export function TodoListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <TodoItemSkeleton key={i} />
      ))}
    </div>
  )
}
