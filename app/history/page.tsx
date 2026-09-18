"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Download, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InitialAvatar } from "@/components/InitialAvatar"
import { useStore } from "@/lib/store"
import { formatCurrency, formatDateLabel, formatTime } from "@/lib/format"
import { downloadCsv, transactionsToCsv } from "@/lib/exportCsv"
import type { Transaction } from "@/lib/types"

export default function HistoryPage() {
  const transactions = useStore((s) => s.transactions)

  function handleExport() {
    const sorted = [...transactions].sort((a, b) => b.timestamp - a.timestamp)
    const csv = transactionsToCsv(sorted)
    const date = new Date().toISOString().slice(0, 10)
    downloadCsv(`upi-split-transactions-${date}.csv`, csv)
  }

  const grouped = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => b.timestamp - a.timestamp)
    const groups = new Map<string, Transaction[]>()

    for (const tx of sorted) {
      const label = formatDateLabel(tx.timestamp)
      const bucket = groups.get(label) ?? []
      bucket.push(tx)
      groups.set(label, bucket)
    }

    return Array.from(groups.entries())
  }, [transactions])

  return (
    <main className="flex flex-col gap-4 px-4 py-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Transaction history</h1>
          <p className="text-sm text-muted-foreground">
            All your payments, newest first.
          </p>
        </div>
        {transactions.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export CSV
          </Button>
        )}
      </header>

      {transactions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(([label, txs]) => (
            <section key={label}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
              </h2>
              <ul className="flex flex-col gap-2">
                {txs.map((tx) => (
                  <TransactionRow key={tx.id} transaction={tx} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const [expanded, setExpanded] = useState(false)

  const statusColor =
    transaction.status === "success"
      ? "bg-primary"
      : transaction.status === "pending"
      ? "bg-amber-500"
      : "bg-red-500"

  return (
    <li className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/50"
      >
        <InitialAvatar name={transaction.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{transaction.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {transaction.upiId}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-red-600 tabular-nums">
            -{formatCurrency(transaction.amount)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatTime(transaction.timestamp)}
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/60 bg-muted/30"
          >
            <div className="px-3 py-2.5 text-xs text-muted-foreground">
              {transaction.chunks.length > 1 ? (
                <p>
                  Paid in {transaction.chunks.length} parts:{" "}
                  {transaction.chunks
                    .map((chunk) => formatCurrency(chunk))
                    .join(" + ")}
                </p>
              ) : (
                <p>Paid in a single transaction of {formatCurrency(transaction.amount)}</p>
              )}
              <p className="mt-1.5 flex items-center gap-1.5 capitalize">
                <span className={`h-1.5 w-1.5 rounded-full ${statusColor}`} />
                {transaction.status}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Receipt className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">No transactions yet</p>
        <p className="text-xs text-muted-foreground">
          Payments you send will appear here.
        </p>
      </div>
    </div>
  )
}
