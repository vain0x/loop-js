import type { Flow, LoopInterface } from "../loop_types"

export const loopJoin = (loop: LoopInterface<unknown>, sep: string): string => {
  const flow: Flow = { running: true }
  let first = true
  let output = ""
  loop.iterate(item => {
    if (first) {
      first = false
    } else {
      output += sep
    }
    output += item
  }, flow)
  return output
}
