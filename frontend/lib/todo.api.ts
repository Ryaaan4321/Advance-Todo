import { TodosResponse } from "@/components/todos/todo-app"
import type { Todo } from "@/types/todo"

export const createTodoApi = (
    authFetch: <T>(
        url: string,
        options?: RequestInit
    ) => Promise<T>
) => ({
    getAll: () => authFetch<TodosResponse>("/tasks"),

    create: (title: string, description: string) =>
        authFetch<Todo>("/todos", {
            method: "POST",
            body: JSON.stringify({ title, description }),
        }),

    update: (id: string, updates: Partial<Todo>) =>
        authFetch<Todo>(`/tasks/${id}`, {
            method: "PATCH",
            body: JSON.stringify(updates),
        }),

    delete: (id: string) =>
        authFetch<void>(`/tasks/${id}`, {
            method: "DELETE",
        }),

    toggle: (id: string) =>
        authFetch<Todo>(`/tasks/${id}/toggle`, {
            method: "PATCH",
        }),
})
