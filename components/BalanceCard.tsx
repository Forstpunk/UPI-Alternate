"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { formatCurrency } from "@/lib/format"

interface BalanceCardProps {
  balance: number
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const [visible, setVisible] = useState(true)

  return (
    <div className="text-white">
      <p className="text-xs font-medium uppercase tracking-wide text-white/60">
        Available balance
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="text-4xl font-semibold tracking-tight tabular-nums">
          {visible ? formatCurrency(balance) : "₹ ••,•••"}
        </span>
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide balance" : "Show balance"}
          className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
