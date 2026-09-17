"use client"

import Link from "next/link"
import { Send, Download, ScanLine, Clock } from "lucide-react"
import { useStore } from "@/lib/store"
import { BalanceCard } from "@/components/BalanceCard"
import { RecentTransactions } from "@/components/RecentTransactions"

const quickActions = [
  { href: "/send", label: "Send", icon: Send },
  { href: "/send", label: "Request", icon: Download },
  { href: "/receive", label: "Scan", icon: ScanLine },
  { href: "/history", label: "History", icon: Clock },
]

export default function HomePage() {
  const balance = useStore((state) => state.balance)
  const getRecentTransactions = useStore((state) => state.getRecentTransactions)
  const recent = getRecentTransactions(5)

  return (
    <main>
      <header
        className="relative overflow-hidden px-4 pb-9 pt-6"
        style={{
          background:
            "radial-gradient(120% 100% at 100% 0%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 45%), linear-gradient(160deg, #0b3d2e 0%, #14532d 55%, #1a6b3c 100%)",
        }}
      >
        <div className="relative flex items-center justify-between">
          <p className="text-sm font-semibold tracking-tight text-white/85">
            UPI Split
          </p>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white ring-1 ring-white/15">
            Y
          </span>
        </div>
        <div className="relative mt-5">
          <BalanceCard balance={balance} />
        </div>
      </header>

      <section className="relative -mt-6 px-4">
        <div className="grid grid-cols-4 gap-1 rounded-2xl border border-border/60 bg-card p-3 shadow-md">
          {quickActions.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-1.5 rounded-xl py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight">
            Recent transactions
          </h2>
          <Link
            href="/history"
            className="text-xs font-semibold text-primary transition hover:text-primary/80"
          >
            View all
          </Link>
        </div>
        <RecentTransactions transactions={recent} />
      </section>
    </main>
  )
}
