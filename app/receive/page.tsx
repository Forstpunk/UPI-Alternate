"use client"

import { useMemo, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Copy, Share2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { formatCurrency } from "@/lib/format"

export default function ReceivePage() {
  const myUpiId = useStore((s) => s.myUpiId)
  const myName = useStore((s) => s.myName)

  const [requestAmount, setRequestAmount] = useState("")
  const [copied, setCopied] = useState(false)

  const parsedAmount = Number(requestAmount)
  const hasValidAmount = requestAmount.trim() !== "" && parsedAmount > 0

  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: myUpiId,
      pn: myName,
    })
    if (hasValidAmount) {
      params.set("am", parsedAmount.toFixed(2))
    }
    return `upi://pay?${params.toString()}`
  }, [myUpiId, myName, hasValidAmount, parsedAmount])

  async function handleShare() {
    const shareData = {
      title: "Pay me via UPI",
      text: hasValidAmount
        ? `Pay me ${formatCurrency(parsedAmount)} via UPI: ${myUpiId}`
        : `Pay me via UPI: ${myUpiId}`,
      url: upiLink,
    }

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // user cancelled or share failed, fall back to copy
      }
    }

    await copyToClipboard(upiLink)
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable, silently ignore
    }
  }

  return (
    <main className="flex flex-col gap-6 px-4 py-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Receive money</h1>
        <p className="text-sm text-muted-foreground">
          Share your QR or UPI ID to get paid.
        </p>
      </header>

      <Card className="flex flex-col items-center gap-4 border-border/60 p-6 shadow-sm">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <QRCodeSVG value={upiLink} size={200} level="M" marginSize={2} />
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">{myName}</p>
          <p className="font-medium">{myUpiId}</p>
          {hasValidAmount && (
            <p className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary tabular-nums">
              Requesting {formatCurrency(parsedAmount)}
            </p>
          )}
        </div>

        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => copyToClipboard(myUpiId)}
          >
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied!" : "Copy UPI ID"}
          </Button>
          <Button className="flex-1" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </Card>

      <Separator />

      <Card className="flex flex-col gap-3 border-border/60 p-4 shadow-sm">
        <div>
          <p className="text-sm font-semibold">Request a specific amount</p>
          <p className="text-xs text-muted-foreground">
            The QR code above will update to include the amount.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-muted-foreground">₹</span>
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="0.00"
            value={requestAmount}
            onChange={(e) => setRequestAmount(e.target.value)}
          />
        </div>
        <Button
          variant={hasValidAmount ? "default" : "secondary"}
          disabled={!hasValidAmount}
          onClick={() => {
            /* QR already reacts to requestAmount via useMemo */
          }}
        >
          {hasValidAmount
            ? `Request ${formatCurrency(parsedAmount)}`
            : "Enter an amount to request"}
        </Button>
      </Card>
    </main>
  )
}
