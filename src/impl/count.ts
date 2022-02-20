import type { Flow, LoopInterface } from "../loop_types"

export const loopCount = (source: LoopInterface<unknown>): number => {
  const flow: Flow = { running: true }
  let n = 0
  source.iterate(() => { n++ }, flow)
  return n
}
