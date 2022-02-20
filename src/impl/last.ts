import type { LoopInterface } from "../loop_types"

export const loopLast = <T>(source: LoopInterface<T>): T | undefined => {
  let last: T | undefined
  source.iterate(item => { last = item }, { running: true })
  return last
}
