import type { LoopInterface } from "../loop_types"

export const loopLast = <T>(source: LoopInterface<T>): T | undefined => {
  const flow = { running: true }
  let last: T | undefined
  source.iterate(item => { last = item }, flow)
  return last
}
