"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"

interface TodoFormProps {
    onAddTodo: (title: string, description: string) => void
}

export default function TodoForm({ onAddTodo }: TodoFormProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isExpanded, setIsExpanded] = useState(false)
    const {accessToken}=useAuth();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            onAddTodo(title, description)
            setTitle("")
            setDescription("")
            setIsExpanded(false)
        }
        
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="border border-border rounded-lg p-4 bg-card transition-all">
                <Input
                    type="text"
                    placeholder="Add a new task..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setIsExpanded(true)}
                    className="border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0"
                />

                {isExpanded && (
                    <div className="mt-3 space-y-3">
                        <textarea
                            placeholder="Add a description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                            rows={2}
                        />

                        <div className="flex gap-2 justify-end">
                            <Button
                                type="button"
                                className="cursor-pointer"
                                variant="outline"
                                onClick={() => {
                                    setIsExpanded(false)
                                    setTitle("")
                                    setDescription("")
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="cursor-pointer">Add Task</Button>
                        </div>
                    </div>
                )}
            </div>
        </form>
    )
}
