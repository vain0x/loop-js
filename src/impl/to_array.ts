import type { Flow, LoopInterface } from "../loop_types"

export const loopToArray = <T>(loop: LoopInterface<T>) => {
  const flow: Flow = { running: true }
  const output: T[] = []
  loop.iterate(item => { output.push(item) }, flow)
  return output
}
