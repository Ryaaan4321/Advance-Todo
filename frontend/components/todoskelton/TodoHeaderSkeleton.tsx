import { Skeleton } from "@/components/ui/skeleton"

export function TodoHeaderSkeleton() {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" /> 
          <Skeleton className="h-4 w-40" /> 
        </div>

        <Skeleton className="h-8 w-20 rounded-md" /> 
      </div>
    </header>
  )
}
