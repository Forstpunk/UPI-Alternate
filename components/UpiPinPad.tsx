"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Delete, Loader2, ShieldCheck } from "lucide-react"
import { formatCurrency } from "@/lib/format"

const PIN_LENGTH = 4
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"]

interface UpiPinPadProps {
  amount: number
  payeeName: string
  onSuccess: () => void
  onCancel: () => void
}

export function UpiPinPad({
  amount,
  payeeName,
  onSuccess,
  onCancel,
}: UpiPinPadProps) {
  const [pin, setPin] = useState("")
  const [verifying, setVerifying] = useState(false)

  function press(key: string) {
    if (verifying) return
    if (key === "back") {
      setPin((p) => p.slice(0, -1))
      return
    }
    if (key === "" || pin.length >= PIN_LENGTH) return

    const next = pin + key
    setPin(next)

    if (next.length === PIN_LENGTH) {
      setVerifying(true)
      setTimeout(onSuccess, 600)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="flex flex-col items-center gap-6 py-4 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <ShieldCheck className="h-6 w-6 text-primary" />
      </div>

      <div>
        <p className="text-sm font-medium">Enter UPI PIN</p>
        <p className="mt-1 text-xs text-muted-foreground">
          to pay {formatCurrency(amount)} to {payeeName}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {verifying ? (
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying...
          </span>
        ) : (
          Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full border-2 transition-colors ${
                i < pin.length
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/30"
              }`}
            />
          ))
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {KEYS.map((key, i) =>
          key === "" ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              type="button"
              disabled={verifying}
              onClick={() => press(key)}
              aria-label={key === "back" ? "Backspace" : `Digit ${key}`}
              className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              {key === "back" ? <Delete className="h-5 w-5" /> : key}
            </button>
          )
        )}
      </div>

      {!verifying && (
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
        >
          Cancel
        </button>
      )}

      <p className="text-[11px] text-muted-foreground">
        Simulated PIN check — any 4 digits work, nothing is sent anywhere.
      </p>
    </motion.div>
  )
}
