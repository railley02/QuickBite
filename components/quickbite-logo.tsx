// QuickBite Logo component matching Figma design
export function QuickBiteLogo({
  variant = "dark",
  size = "default",
}: {
  variant?: "dark" | "light"
  size?: "small" | "default" | "large"
}) {
  const textColor = variant === "light" ? "text-white" : "text-primary"
  const sizeClasses = {
    small: { container: "gap-1", text: "text-lg", qb: "text-2xl" },
    default: { container: "gap-2", text: "text-xl", qb: "text-3xl" },
    large: { container: "gap-3", text: "text-2xl", qb: "text-4xl" },
  }
  const s = sizeClasses[size]

  return (
    <div className={`flex flex-col items-center ${s.container}`}>
      <span className={`font-bold ${s.qb} ${textColor}`}>QB</span>
      <span className={`font-semibold tracking-wider ${s.text} ${textColor}`}>QUICKBITE</span>
    </div>
  )
}
