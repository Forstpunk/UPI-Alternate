"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  ChevronDown,
  Share2,
  Users,
  UsersRound,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InitialAvatar } from "@/components/InitialAvatar"
import { useStore } from "@/lib/store"
import { splitBillEqually } from "@/lib/splitBill"
import { formatCurrency, formatDateLabel } from "@/lib/format"
import type { SplitBill, SplitBillParticipant } from "@/lib/types"

export default function SplitBillPage() {
  const contacts = useStore((s) => s.contacts)
  const myName = useStore((s) => s.myName)
  const myUpiId = useStore((s) => s.myUpiId)
  const splitBills = useStore((s) => s.splitBills)
  const addSplitBill = useStore((s) => s.addSplitBill)
  const toggleParticipantPaid = useStore((s) => s.toggleParticipantPaid)

  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const parsedAmount = Number(amount)
  const hasValidAmount = amount.trim() !== "" && parsedAmount > 0
  const participantCount = 1 + selectedIds.length

  const shares = useMemo(() => {
    if (!hasValidAmount) return []
    return splitBillEqually(parsedAmount, participantCount)
  }, [hasValidAmount, parsedAmount, participantCount])

  function toggleContact(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  function handleSave() {
    if (!hasValidAmount) return

    const selectedContacts = contacts.filter((c) => selectedIds.includes(c.id))
    const participants: SplitBillParticipant[] = [
      {
        contactId: "me",
        name: myName,
        upiId: myUpiId,
        amount: shares[0],
        paid: true,
      },
      ...selectedContacts.map((c, i) => ({
        contactId: c.id,
        name: c.name,
        upiId: c.upiId,
        amount: shares[i + 1],
        paid: false,
      })),
    ]

    const bill: SplitBill = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `split-${Date.now()}`,
      title: title.trim() || "Split bill",
      totalAmount: parsedAmount,
      participants,
      timestamp: Date.now(),
    }

    addSplitBill(bill)
    setTitle("")
    setAmount("")
    setSelectedIds([])
  }

  return (
    <main className="flex flex-col gap-6 px-4 py-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Split a bill</h1>
        <p className="text-sm text-muted-foreground">
          Divide an amount between friends and track who&apos;s paid you back.
        </p>
      </header>

      <Card className="flex flex-col gap-4 border-border/60 p-4 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium">
            What&apos;s this for?
          </label>
          <Input
            id="title"
            placeholder="Dinner, trip, rent..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="total" className="text-sm font-medium">
            Total amount
          </label>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-muted-foreground">₹</span>
            <Input
              id="total"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium">Split with</p>
          <div className="flex flex-col gap-0.5 rounded-2xl border border-border/60 bg-card p-1.5">
            <div className="flex items-center gap-3 rounded-xl px-2.5 py-2">
              <InitialAvatar name={myName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{myName} (you)</p>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </span>
            </div>

            {contacts.map((c) => {
              const checked = selectedIds.includes(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleContact(c.id)}
                  className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-muted"
                >
                  <InitialAvatar name={c.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.upiId}
                    </p>
                  </div>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                      checked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {checked && <Check className="h-3 w-3" />}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {hasValidAmount && (
          <p className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-center text-xs font-medium text-amber-700">
            {formatCurrency(shares[0])} each between {participantCount}{" "}
            {participantCount === 1 ? "person" : "people"}
          </p>
        )}

        <Button size="lg" disabled={!hasValidAmount} onClick={handleSave}>
          <UsersRound className="mr-2 h-4 w-4" />
          Save split
        </Button>
      </Card>

      <section>
        <h2 className="mb-3 text-base font-semibold tracking-tight">
          Past splits
        </h2>
        {splitBills.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3">
            {splitBills.map((bill) => (
              <SplitBillCard
                key={bill.id}
                bill={bill}
                onTogglePaid={(contactId) =>
                  toggleParticipantPaid(bill.id, contactId)
                }
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function SplitBillCard({
  bill,
  onTogglePaid,
}: {
  bill: SplitBill
  onTogglePaid: (contactId: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  const collected = bill.participants
    .filter((p) => p.paid)
    .reduce((sum, p) => sum + p.amount, 0)
  const progress = Math.round((collected / bill.totalAmount) * 100)

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/50"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{bill.title}</p>
          <p className="text-xs text-muted-foreground">
            {formatDateLabel(bill.timestamp)} · {bill.participants.length}{" "}
            people
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold tabular-nums">
            {formatCurrency(bill.totalAmount)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(collected)} collected
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div className="h-1 w-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/60 bg-muted/30"
          >
            <ul className="flex flex-col gap-1 p-2">
              {bill.participants.map((p) => (
                <ParticipantRow
                  key={p.contactId}
                  participant={p}
                  billTitle={bill.title}
                  onTogglePaid={() => onTogglePaid(p.contactId)}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function ParticipantRow({
  participant,
  billTitle,
  onTogglePaid,
}: {
  participant: SplitBillParticipant
  billTitle: string
  onTogglePaid: () => void
}) {
  const isMe = participant.contactId === "me"

  async function remind() {
    const message = `Hey! You owe ${formatCurrency(
      participant.amount
    )} for "${billTitle}" — pay me at ${participant.upiId}`

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text: message })
        return
      } catch {
        // cancelled or unsupported, fall back to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(message)
    } catch {
      // clipboard unavailable, silently ignore
    }
  }

  return (
    <li className="flex items-center gap-3 rounded-xl px-2 py-2">
      <InitialAvatar name={participant.name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {participant.name}
          {isMe ? " (you)" : ""}
        </p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {formatCurrency(participant.amount)}
        </p>
      </div>

      {!isMe && !participant.paid && (
        <button
          type="button"
          onClick={remind}
          aria-label={`Remind ${participant.name}`}
          className="flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-xs font-medium transition hover:bg-muted"
        >
          <Share2 className="h-3 w-3" />
          Remind
        </button>
      )}

      {!isMe && (
        <button
          type="button"
          onClick={onTogglePaid}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
            participant.paid
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {participant.paid ? "Paid" : "Mark paid"}
        </button>
      )}
    </li>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">No splits yet</p>
        <p className="text-xs text-muted-foreground">
          Split a bill above to start tracking who owes you.
        </p>
      </div>
    </div>
  )
}
