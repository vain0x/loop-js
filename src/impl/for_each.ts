import type { Flow, LoopInterface } from "../loop_types"

export const loopForEach = <T>(loop: LoopInterface<T>, action: (item: T, index: number) => void, flow: Flow) => {
  let index = 0
  loop.iterate(item => {
    action(item, index++)
  }, flow)
}
