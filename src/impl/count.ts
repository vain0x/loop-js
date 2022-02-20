import type { LoopInterface } from "../loop_types"

export const loopCount = (source: LoopInterface<unknown>): number => {
  let n = 0
  source.iterate(() => { n++ }, { running: true })
  return n
}
