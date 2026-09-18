import { describe, expect, it } from "vitest"
import { splitBillEqually } from "./splitBill"

describe("splitBillEqually", () => {
  it("splits evenly when it divides cleanly", () => {
    expect(splitBillEqually(300, 3)).toEqual([100, 100, 100])
  })

  it("distributes leftover paise to the first participants", () => {
    expect(splitBillEqually(100, 3)).toEqual([33.34, 33.33, 33.33])
  })

  it("handles a single participant", () => {
    expect(splitBillEqually(499, 1)).toEqual([499])
  })

  it("always sums back to the original total", () => {
    for (const [total, count] of [
      [100, 3],
      [999.99, 7],
      [1, 6],
      [123456.78, 11],
    ] as const) {
      const shares = splitBillEqually(total, count)
      const sum = shares.reduce((a, b) => a + b, 0)
      expect(Math.round(sum * 100)).toBe(Math.round(total * 100))
      expect(shares).toHaveLength(count)
    }
  })

  it("throws for a non-positive total or participant count", () => {
    expect(() => splitBillEqually(0, 3)).toThrow()
    expect(() => splitBillEqually(-50, 3)).toThrow()
    expect(() => splitBillEqually(100, 0)).toThrow()
    expect(() => splitBillEqually(100, 1.5)).toThrow()
  })
})
