'use client'

export default function ElegantLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
      <div className="flex flex-col items-center gap-8">
        {/* Bold Premium Spinner */}
        <div className="relative h-20 w-20">
          {/* Outer ring with more visibility */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/25" />
          
          {/* Main bold animated spinner */}
          <div
            className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-primary/70"
            style={{
              animationDuration: '2s',
              animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          
          {/* Center accent dot - larger and bolder */}
          <div className="absolute inset-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg shadow-primary/50" />
        </div>

        {/* Bold Typography */}
        <div className="text-center space-y-3">
          <p className="text-lg font-bold text-foreground tracking-wide">
            Cooking
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            Please wait a moment
          </p>
        </div>
      </div>
    </div>
  )
}
