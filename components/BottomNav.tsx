"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Send, QrCode, Clock, UsersRound } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/send", label: "Send", icon: Send },
  { href: "/receive", label: "Receive", icon: QrCode },
  { href: "/split", label: "Split", icon: UsersRound },
  { href: "/history", label: "History", icon: Clock },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 border-t border-border/70 bg-background/95 shadow-[0_-4px_16px_-8px_rgba(15,23,42,0.12)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <ul className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "mx-auto flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
