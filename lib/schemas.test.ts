import { describe, expect, it } from "vitest"
import { amountSchema, upiIdSchema } from "./schemas"

describe("upiIdSchema", () => {
  it("accepts valid UPI IDs", () => {
    for (const upiId of [
      "aarav.sharma@okaxis",
      "priya_nair@okicici",
      "9876543210@ybl",
      "a.b-c_9@oksbi",
    ]) {
      expect(upiIdSchema.safeParse({ upiId }).success).toBe(true)
    }
  })

  it("rejects malformed UPI IDs", () => {
    for (const upiId of ["", "no-at-sign", "@bank", "name@", "name@1bank"]) {
      expect(upiIdSchema.safeParse({ upiId }).success).toBe(false)
    }
  })

  it("trims surrounding whitespace before validating", () => {
    const result = upiIdSchema.safeParse({ upiId: "  aarav.sharma@okaxis  " })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.upiId).toBe("aarav.sharma@okaxis")
    }
  })
})

describe("amountSchema", () => {
  it("accepts amounts within range", () => {
    expect(amountSchema.safeParse({ amount: 1 }).success).toBe(true)
    expect(amountSchema.safeParse({ amount: 100000 }).success).toBe(true)
  })

  it("rejects amounts outside the allowed range", () => {
    expect(amountSchema.safeParse({ amount: 0 }).success).toBe(false)
    expect(amountSchema.safeParse({ amount: -10 }).success).toBe(false)
    expect(amountSchema.safeParse({ amount: 100001 }).success).toBe(false)
  })

  it("coerces numeric strings from form inputs", () => {
    const result = amountSchema.safeParse({ amount: "250" })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.amount).toBe(250)
    }
  })
})
