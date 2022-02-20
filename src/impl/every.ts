import type { LoopInterface } from "../loop_types"

export const loopEvery = <T>(source: LoopInterface<T>, predicate: (item: T, index: number) => boolean): boolean => {
  const flow = { running: true }
  let ok = true
  let index = 0
  source.iterate(item => {
    if (!predicate(item, index++)) {
      ok = false
      flow.running = false
    }
  }, flow)
  return ok
}
