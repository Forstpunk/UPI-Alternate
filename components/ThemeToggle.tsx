"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

const STORAGE_KEY = "upi-split-theme"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light")
    } catch {
      // localStorage unavailable, theme just won't persist
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-6 w-6 items-center justify-center rounded-full text-amber-950/70 transition hover:text-amber-950"
    >
      {isDark === null ? null : isDark ? (
        <Sun className="h-3.5 w-3.5" />
      ) : (
        <Moon className="h-3.5 w-3.5" />
      )}
    </button>
  )
}
