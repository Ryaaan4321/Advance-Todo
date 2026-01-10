import { Skeleton } from "@/components/ui/skeleton"

export function TodoFormSkeleton() {
  return (
    <div className="border border-border rounded-lg p-4 bg-card space-y-4">
      <Skeleton className="h-5 w-full" /> 

      <div className="space-y-3">
        <Skeleton className="h-16 w-full" /> 
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  )
}
