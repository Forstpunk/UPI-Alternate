import Link from "next/link"
import { Receipt } from "lucide-react"
import type { Transaction } from "@/lib/types"
import { InitialAvatar } from "@/components/InitialAvatar"
import { formatCurrency, formatTime } from "@/lib/format"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/50 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Receipt className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">No transactions yet</p>
        <p className="text-xs text-muted-foreground">
          Your recent payments will show up here.
        </p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border rounded-2xl border border-border/60 bg-card shadow-sm">
      {transactions.map((tx) => (
        <li key={tx.id}>
          <Link
            href="/history"
            className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-muted/60"
          >
            <InitialAvatar name={tx.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{tx.name}</p>
              <p className="truncate text-xs text-muted-foreground">{tx.upiId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-red-600 tabular-nums">
                -{formatCurrency(tx.amount)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTime(tx.timestamp)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
