export function formatCurrency(amount: number): string {
  const isNegative = amount < 0
  const absAmount = Math.abs(amount)

  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: absAmount % 1 === 0 ? 0 : 2,
  }).format(absAmount)

  return `${isNegative ? "-" : ""}₹${formatted}`
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatDateLabel(timestamp: number): string {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (isSameDay(date, today)) return "Today"
  if (isSameDay(date, yesterday)) return "Yesterday"

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  })
}
