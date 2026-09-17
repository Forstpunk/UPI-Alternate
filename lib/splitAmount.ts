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

// --- Manual verification (not a test runner, just a sanity check) ---
if (require.main === module) {
  const cases: Array<[number, number | undefined, number[]]> = [
    [5000, undefined, [1999, 1999, 1002]],
    [1999, undefined, [1999]],
    [2000, undefined, [1999, 1]],
    [100, undefined, [100]],
    [3998, undefined, [1999, 1999]],
  ]

  for (const [amount, limit, expected] of cases) {
    const result = limit === undefined ? splitAmount(amount) : splitAmount(amount, limit)
    const pass = JSON.stringify(result) === JSON.stringify(expected)
    console.log(
      `${pass ? 'PASS' : 'FAIL'} splitAmount(${amount}${limit ? `, ${limit}` : ''}) => [${result}] expected [${expected}]`
    )
  }

  try {
    splitAmount(0)
    console.log('FAIL splitAmount(0) should have thrown')
  } catch {
    console.log('PASS splitAmount(0) throws')
  }

  try {
    splitAmount(-500)
    console.log('FAIL splitAmount(-500) should have thrown')
  } catch {
    console.log('PASS splitAmount(-500) throws')
  }
}
