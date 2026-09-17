const COLORS = [
  "bg-rose-600",
  "bg-amber-600",
  "bg-teal-600",
  "bg-sky-600",
  "bg-violet-600",
  "bg-pink-600",
  "bg-orange-600",
  "bg-indigo-600",
]

function colorForName(name: string): string {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return COLORS[sum % COLORS.length]
}

interface InitialAvatarProps {
  name: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses: Record<NonNullable<InitialAvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
}

export function InitialAvatar({ name, size = "md" }: InitialAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?"

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${colorForName(
        name
      )} ${sizeClasses[size]}`}
    >
      {initial}
    </div>
  )
}
