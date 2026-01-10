"use client"

import { Button } from "@/components/ui/button"

interface TodoHeaderProps {
  onLogout: () => void
}

export default function TodoHeader({ onLogout }: TodoHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          {/* <p className="text-sm text-muted-foreground truncate">{userEmail}</p> */}
        </div>
        <Button onClick={onLogout} variant="outline" size="sm" className="whitespace-nowrap ml-4 bg-transparent cursor-pointer">
          Log Out
        </Button>
      </div>
    </header>
  )
}
