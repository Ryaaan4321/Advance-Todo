import { Skeleton } from "@/components/ui/skeleton"

export function TodoItemSkeleton() {
  return (
    <div className="border border-border rounded-lg p-4 bg-card space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="h-5 w-5 rounded" /> {/* checkbox */}

        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" /> {/* title */}
          <Skeleton className="h-3 w-full" /> {/* description */}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Skeleton className="h-8 w-16" /> 
        <Skeleton className="h-8 w-20" /> 
      </div>
    </div>
  )
}
