import { describe, expect, it } from "vitest"
import { splitAmount } from "./splitAmount"

describe("splitAmount", () => {
  it("returns a single chunk when under the limit", () => {
    expect(splitAmount(100)).toEqual([100])
    expect(splitAmount(1999)).toEqual([1999])
  })

  it("splits an amount just over the limit into two chunks", () => {
    expect(splitAmount(2000)).toEqual([1999, 1])
  })

  it("splits an exact multiple of the limit into equal chunks", () => {
    expect(splitAmount(3998)).toEqual([1999, 1999])
  })

  it("splits a large amount into full chunks plus a remainder", () => {
    expect(splitAmount(5000)).toEqual([1999, 1999, 1002])
  })

  it("respects a custom limit", () => {
    expect(splitAmount(2500, 1000)).toEqual([1000, 1000, 500])
  })

  it("avoids floating point drift with decimal amounts", () => {
    expect(splitAmount(0.3)).toEqual([0.3])
    expect(splitAmount(3999.9, 1999.99)).toEqual([1999.99, 1999.91])
  })

  it("throws for zero or negative amounts", () => {
    expect(() => splitAmount(0)).toThrow()
    expect(() => splitAmount(-500)).toThrow()
  })

  it("every chunk stays within the limit and the total is preserved", () => {
    for (const amount of [1, 1999, 2000, 4999.5, 99999]) {
      const chunks = splitAmount(amount)
      const total = chunks.reduce((sum, c) => sum + c, 0)

      expect(Math.round(total * 100)).toBe(Math.round(amount * 100))
      for (const chunk of chunks) {
        expect(chunk).toBeLessThanOrEqual(1999)
        expect(chunk).toBeGreaterThan(0)
      }
    }
  })
})
