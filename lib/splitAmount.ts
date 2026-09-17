/**
 * Splits an amount (in rupees) into chunks no larger than `limit` (in rupees).
 * Internally works in paise (integer) to avoid floating point drift, and
 * returns chunk amounts back in rupees.
 */
export function splitAmount(amount: number, limit = 1999): number[] {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0')
  }

  const amountPaise = Math.round(amount * 100)
  const limitPaise = Math.round(limit * 100)

  const chunks: number[] = []
  let remaining = amountPaise

  while (remaining > 0) {
    const chunkPaise = Math.min(remaining, limitPaise)
    chunks.push(chunkPaise / 100)
    remaining -= chunkPaise
  }

  return chunks
}
