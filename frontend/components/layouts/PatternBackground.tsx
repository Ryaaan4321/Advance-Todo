export default function PatternBackground({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full relative bg-white overflow-hidden">
      {/* Teal Glow Bottom */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at bottom center,
              rgba(56, 193, 182, 0.5),
              transparent 70%
            )
          `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
