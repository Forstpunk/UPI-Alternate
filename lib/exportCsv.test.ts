import { describe, expect, it } from "vitest"
import { transactionsToCsv } from "./exportCsv"
import type { Transaction } from "./types"

const tx = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: "tx-1",
  upiId: "aarav.sharma@okaxis",
  name: "Aarav Sharma",
  amount: 2000,
  chunks: [1999, 1],
  status: "success",
  timestamp: Date.UTC(2026, 0, 15, 10, 30),
  ...overrides,
})

describe("transactionsToCsv", () => {
  it("includes a header row and one row per transaction", () => {
    const csv = transactionsToCsv([tx()])
    const lines = csv.split("\n")

    expect(lines).toHaveLength(2)
    expect(lines[0]).toBe("Date,Name,UPI ID,Amount,Chunks,Status")
    expect(lines[1]).toContain("Aarav Sharma")
    expect(lines[1]).toContain("aarav.sharma@okaxis")
    expect(lines[1]).toContain("2000.00")
    expect(lines[1]).toContain("1999.00 + 1.00")
    expect(lines[1]).toContain("success")
  })

  it("returns just the header row for an empty list", () => {
    expect(transactionsToCsv([])).toBe("Date,Name,UPI ID,Amount,Chunks,Status")
  })

  it("quotes and escapes fields containing commas or quotes", () => {
    const csv = transactionsToCsv([tx({ name: 'Aarav "AC" Sharma, Jr.' })])
    const dataLine = csv.split("\n")[1]

    expect(dataLine).toContain('"Aarav ""AC"" Sharma, Jr."')
  })
})
