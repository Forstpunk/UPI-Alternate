/**
 * Splits a bill total (in rupees) equally among `participantCount` people.
 * Works in paise internally so the shares always sum back to the exact
 * total, with any leftover paise going to the first few participants.
 */
export function splitBillEqually(
  total: number,
  participantCount: number
): number[] {
  if (total <= 0) {
    throw new Error("Total must be greater than 0")
  }
  if (participantCount <= 0 || !Number.isInteger(participantCount)) {
    throw new Error("Participant count must be a positive integer")
  }

  const totalPaise = Math.round(total * 100)
  const basePaise = Math.floor(totalPaise / participantCount)
  const remainder = totalPaise - basePaise * participantCount

  return Array.from(
    { length: participantCount },
    (_, i) => (basePaise + (i < remainder ? 1 : 0)) / 100
  )
}
