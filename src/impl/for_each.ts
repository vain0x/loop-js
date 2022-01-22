import type { LoopInterface } from "../loop"

export const loopForEach = <T>(loop: LoopInterface<T>, action: (item: T, index: number) => void) => {
  let index = 0
  loop.iterate(item => {
    action(item, index++)
  })
}
