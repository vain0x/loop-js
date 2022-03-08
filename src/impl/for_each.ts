import type { Flow, LoopInterface } from "../loop_types"

export const loopForEach = <T>(loop: LoopInterface<T>, action: (item: T, index: number) => void) => {
  const flow: Flow = { running: true }
  let index = 0
  loop.iterate(item => {
    action(item, index++)
  }, flow)
}
