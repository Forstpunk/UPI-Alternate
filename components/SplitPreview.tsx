"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { splitAmount } from "@/lib/splitAmount"
import { mockProcess } from "@/lib/mockProcess"
import { useStore } from "@/lib/store"
import { formatCurrency } from "@/lib/format"

type ChunkStatus = "pending" | "processing" | "done"

interface Payee {
  upiId: string
  name: string
}

interface SplitPreviewProps {
  amount: number
  payee: Payee
  onDone: () => void
}

const CONFETTI_COLORS = [
  "#059669",
  "#10b981",
  "#34d399",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
]

export function SplitPreview({ amount, payee, onDone }: SplitPreviewProps) {
  const chunks = useMemo(() => splitAmount(amount), [amount])
  const [statuses, setStatuses] = useState<ChunkStatus[]>(
    () => chunks.map(() => "pending")
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const addTransaction = useStore((s) => s.addTransaction)
  const deductBalance = useStore((s) => s.deductBalance)

  async function handlePay() {
    if (isProcessing || isComplete) return

    setIsProcessing(true)
    setStatuses((prev) => prev.map((s, i) => (i === 0 ? "processing" : s)))

    await mockProcess(chunks, (index) => {
      setStatuses((prev) =>
        prev.map((status, i) => {
          if (i === index) return "done"
          if (i === index + 1) return "processing"
          return status
        })
      )
    })

    addTransaction({
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `tx-${Date.now()}`,
      upiId: payee.upiId,
      name: payee.name,
      amount,
      chunks,
      status: "success",
      timestamp: Date.now(),
    })
    deductBalance(amount)

    setIsProcessing(false)
    setIsComplete(true)
  }

  if (isComplete) {
    return <SuccessScreen amount={amount} payee={payee} onDone={onDone} />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Paying</p>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {formatCurrency(amount)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">to {payee.name}</p>
      </div>

      {chunks.length > 1 && (
        <div className="relative flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <span>Split into {chunks.length} transactions</span>
          <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            aria-label="Why is this split?"
            className="rounded-full p-0.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-6 z-10 w-64 rounded-lg border bg-popover p-3 text-left text-xs text-popover-foreground shadow-md"
              >
                UPI enforces a per-transaction limit of ₹1,999 for many bank
                and app combinations. Amounts above that are automatically
                split into multiple transactions that are sent one after
                another.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {chunks.map((chunk, index) => (
          <ChunkCard
            key={index}
            index={index}
            total={chunks.length}
            amount={chunk}
            status={statuses[index]}
          />
        ))}
      </div>

      <Button
        size="lg"
        className="mt-2 w-full"
        onClick={handlePay}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </span>
        ) : (
          `Pay ${formatCurrency(amount)}`
        )}
      </Button>
    </div>
  )
}

function ChunkCard({
  index,
  total,
  amount,
  status,
}: {
  index: number
  total: number
  amount: number
  status: ChunkStatus
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={`flex items-center justify-between gap-3 border-border/60 p-3 shadow-sm transition-colors duration-300 ${
          status === "done"
            ? "border-primary/30 bg-primary/5"
            : status === "processing"
            ? "border-sky-300 bg-sky-50"
            : "bg-muted/40"
        }`}
      >
        <div>
          <p className="text-sm font-medium">
            Transaction {index + 1} of {total}
          </p>
          <AnimatePresence mode="wait">
            {status === "processing" && (
              <motion.p
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-sky-700"
              >
                Connecting to bank...
              </motion.p>
            )}
          </AnimatePresence>
          {status !== "processing" && (
            <p className="text-xs text-muted-foreground">
              ₹{amount.toFixed(2)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums">
            {formatCurrency(amount)}
          </span>
          <StatusIcon status={status} />
        </div>
      </Card>
    </motion.div>
  )
}

function StatusIcon({ status }: { status: ChunkStatus }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "pending" && (
        <motion.span
          key="pending"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className="h-4 w-4 rounded-full border-2 border-muted-foreground/30"
        />
      )}
      {status === "processing" && (
        <motion.span
          key="processing"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
        >
          <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
        </motion.span>
      )}
      {status === "done" && (
        <motion.span
          key="done"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
        >
          <CheckCircle2 className="h-4 w-4 text-primary" />
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function SuccessScreen({
  amount,
  payee,
  onDone,
}: {
  amount: number
  payee: Payee
  onDone: () => void
}) {
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 260,
        y: -(Math.random() * 200 + 60),
        rotate: Math.random() * 360,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.2,
      })),
    []
  )

  return (
    <div className="relative flex flex-col items-center gap-4 py-10 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confettiPieces.map((piece) => (
          <motion.span
            key={piece.id}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            animate={{ opacity: 0, x: piece.x, y: piece.y, rotate: piece.rotate }}
            transition={{ duration: 1.1, delay: piece.delay, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: "30%",
              width: 8,
              height: 8,
              backgroundColor: piece.color,
              borderRadius: 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
      >
        <CheckCircle2 className="h-9 w-9 text-primary" />
      </motion.div>

      <div>
        <p className="text-lg font-semibold tracking-tight">Payment successful</p>
        <p className="mt-1 text-sm text-muted-foreground tabular-nums">
          {formatCurrency(amount)} sent to {payee.name}
        </p>
      </div>

      <Button className="mt-2 w-full" onClick={onDone}>
        Done
      </Button>
    </div>
  )
}
