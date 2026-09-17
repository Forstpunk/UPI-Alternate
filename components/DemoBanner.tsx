import { ThemeToggle } from "@/components/ThemeToggle"

export function DemoBanner() {
  return (
    <div className="sticky top-0 z-50 flex w-full items-center justify-center gap-2 bg-amber-400 px-3 py-1.5 text-xs font-medium text-amber-950">
      <span className="flex-1 text-center">Simulated UPI · No real payments</span>
      <ThemeToggle />
    </div>
  )
}
