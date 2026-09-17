"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ChevronRight, UserRound } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InitialAvatar } from "@/components/InitialAvatar"
import { SplitPreview } from "@/components/SplitPreview"
import { useStore } from "@/lib/store"
import { splitAmount } from "@/lib/splitAmount"
import { cn } from "@/lib/utils"
import {
  upiIdSchema,
  amountSchema,
  type UpiIdFormValues,
  type AmountFormValues,
} from "@/lib/schemas"

interface Payee {
  upiId: string
  name: string
  isNew: boolean
}

const STEP_TITLES = ["Send to", "Enter amount", "Review & pay"]

export default function SendPage() {
  const router = useRouter()
  const contacts = useStore((s) => s.contacts)

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [payee, setPayee] = useState<Payee | null>(null)
  const [amount, setAmount] = useState<number | null>(null)

  function goBack() {
    if (step === 1) {
      router.push("/")
      return
    }
    setStep((s) => (s - 1) as 1 | 2 | 3)
  }

  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b border-border/70 bg-card px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back"
            className="rounded-full p-1.5 transition hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Step {step} of 3
            </p>
            <h1 className="text-base font-semibold tracking-tight">
              {STEP_TITLES[step - 1]}
            </h1>
          </div>
        </div>
        <div className="mt-3 flex gap-1.5">
          {STEP_TITLES.map((title, index) => (
            <span
              key={title}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                index < step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </header>

      <div className="flex-1 px-4 py-6">
        {step === 1 && (
          <StepUpiId
            contacts={contacts}
            initialPayee={payee}
            onResolved={(p) => setPayee(p)}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && payee && (
          <StepAmount
            payee={payee}
            initialAmount={amount}
            onNext={(value) => {
              setAmount(value)
              setStep(3)
            }}
          />
        )}

        {step === 3 && payee && amount !== null && (
          <SplitPreview
            amount={amount}
            payee={payee}
            onDone={() => router.push("/")}
          />
        )}
      </div>
    </main>
  )
}

function StepUpiId({
  contacts,
  initialPayee,
  onResolved,
  onNext,
}: {
  contacts: ReturnType<typeof useStore.getState>["contacts"]
  initialPayee: Payee | null
  onResolved: (payee: Payee) => void
  onNext: () => void
}) {
  const [resolved, setResolved] = useState<Payee | null>(initialPayee)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpiIdFormValues>({
    resolver: zodResolver(upiIdSchema),
    defaultValues: { upiId: initialPayee?.upiId ?? "" },
  })

  function onSubmit(values: UpiIdFormValues) {
    const match = contacts.find(
      (c) => c.upiId.toLowerCase() === values.upiId.trim().toLowerCase()
    )

    const next: Payee = match
      ? { upiId: match.upiId, name: match.name, isNew: false }
      : {
          upiId: values.upiId.trim(),
          name: values.upiId.trim().split("@")[0],
          isNew: true,
        }

    setResolved(next)
    onResolved(next)
  }

  if (resolved) {
    return (
      <div className="flex flex-col gap-4">
        <Card className="flex items-center gap-3 border-border/60 p-4 shadow-sm">
          <InitialAvatar name={resolved.name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{resolved.name}</p>
              {resolved.isNew && (
                <Badge variant="secondary" className="text-[10px]">
                  New payee
                </Badge>
              )}
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {resolved.upiId}
            </p>
          </div>
        </Card>

        <button
          type="button"
          className="self-start text-sm font-semibold text-primary transition hover:text-primary/80"
          onClick={() => setResolved(null)}
        >
          Change UPI ID
        </button>

        <Button size="lg" className="mt-auto w-full" onClick={onNext}>
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="upiId" className="text-sm font-medium">
          Enter UPI ID
        </label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="upiId"
            placeholder="name@bank"
            autoComplete="off"
            autoCapitalize="off"
            className="pl-9"
            {...register("upiId")}
          />
        </div>
        {errors.upiId && (
          <p className="text-xs text-red-600">{errors.upiId.message}</p>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Recent contacts
        </p>
        <div className="flex flex-col gap-0.5 rounded-2xl border border-border/60 bg-card p-1.5 shadow-sm">
          {contacts.slice(0, 5).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() =>
                onSubmit({ upiId: c.upiId })
              }
              className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-muted"
            >
              <InitialAvatar name={c.name} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.upiId}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-2 w-full">
        Continue
      </Button>
    </form>
  )
}

function StepAmount({
  payee,
  initialAmount,
  onNext,
}: {
  payee: Payee
  initialAmount: number | null
  onNext: (amount: number) => void
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AmountFormValues>({
    resolver: zodResolver(amountSchema),
    defaultValues: { amount: initialAmount ?? undefined },
  })

  const watchedAmount = Number(watch("amount")) || 0
  const chunkCount =
    watchedAmount > 0 ? splitAmount(watchedAmount).length : 0

  function onSubmit(values: AmountFormValues) {
    onNext(values.amount)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-h-[70vh] flex-col"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
        <InitialAvatar name={payee.name} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{payee.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {payee.upiId}
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-1 flex-col items-center justify-start gap-2">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold text-muted-foreground">
            ₹
          </span>
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="0.00"
            autoFocus
            className="h-auto w-48 border-none p-0 text-center text-4xl font-semibold tabular-nums shadow-none focus-visible:ring-0"
            {...register("amount")}
          />
        </div>
        {errors.amount && (
          <p className="text-xs text-red-600">{errors.amount.message}</p>
        )}

        {chunkCount > 1 && (
          <p className="mt-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Will be split into {chunkCount} transactions
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full">
        Next
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </form>
  )
}
