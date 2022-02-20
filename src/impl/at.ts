import type { LoopInterface } from "../loop_types"

export const loopAt = <T>(source: LoopInterface<T>, index: number): T | undefined => {
  if (!Number.isInteger(index)) return undefined

  const flow = { running: true }
  let found: T | undefined
  source.iterate(item => {
    if (index === 0) {
      found = item
      flow.running = false
      return
    }
    index--
  }, flow)
  return found
}
