import type { Transaction } from "./types"

const HEADERS = ["Date", "Name", "UPI ID", "Amount", "Chunks", "Status"]

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * Converts transactions to CSV text (newest first, as passed in).
 * Pure and DOM-free so it's easy to unit test independent of the download step.
 */
export function transactionsToCsv(transactions: Transaction[]): string {
  const rows = transactions.map((tx) => [
    new Date(tx.timestamp).toISOString(),
    tx.name,
    tx.upiId,
    tx.amount.toFixed(2),
    tx.chunks.map((c) => c.toFixed(2)).join(" + "),
    tx.status,
  ])

  return [HEADERS, ...rows]
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\n")
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
