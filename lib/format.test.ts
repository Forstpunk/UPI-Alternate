import { describe, expect, it } from "vitest"
import { formatCurrency, formatDateLabel } from "./format"

describe("formatCurrency", () => {
  it("formats whole rupee amounts without decimals", () => {
    expect(formatCurrency(1999)).toBe("₹1,999")
  })

  it("formats fractional amounts with two decimals", () => {
    expect(formatCurrency(1002.5)).toBe("₹1,002.50")
  })

  it("uses Indian digit grouping for large amounts", () => {
    expect(formatCurrency(1234567)).toBe("₹12,34,567")
  })

  it("prefixes negative amounts with a minus sign before the symbol", () => {
    expect(formatCurrency(-500)).toBe("-₹500")
  })
})

describe("formatDateLabel", () => {
  it("labels today and yesterday specially", () => {
    const now = Date.now()
    const yesterday = now - 24 * 60 * 60 * 1000

    expect(formatDateLabel(now)).toBe("Today")
    expect(formatDateLabel(yesterday)).toBe("Yesterday")
  })

  it("falls back to a full date for older timestamps", () => {
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

    const label = formatDateLabel(twoYearsAgo.getTime())
    expect(label).toContain(String(twoYearsAgo.getFullYear()))
  })
})
