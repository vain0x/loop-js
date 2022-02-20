import type { Flow, LoopInterface } from "../loop_types"

export const loopPick = <T, U>(loop: LoopInterface<T>, picker: (value: T, index: number) => U | undefined, flow: Flow): U | undefined => {
  let index = 0
  let found: U | undefined
  loop.iterate(item => {
    found = picker(item, index++)
    if (found !== undefined) {
      flow.running = false
    }
  }, flow)
  return found
}
