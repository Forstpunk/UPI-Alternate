export type ChunkStatus = 'success'

export type OnChunkComplete = (index: number, status: ChunkStatus) => void

function randomDelay(min = 1200, max = 1800): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Simulates processing a list of payment chunks sequentially.
 * Each chunk resolves after a random 1200-1800ms delay, calling
 * onChunkComplete(index, 'success') as it finishes.
 */
export function mockProcess(
  chunks: number[],
  onChunkComplete: OnChunkComplete
): Promise<'success'> {
  return new Promise((resolve) => {
    let index = 0

    const processNext = () => {
      if (index >= chunks.length) {
        resolve('success')
        return
      }

      const currentIndex = index
      setTimeout(() => {
        onChunkComplete(currentIndex, 'success')
        index += 1
        processNext()
      }, randomDelay())
    }

    processNext()
  })
}
