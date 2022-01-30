import type { Flow, LoopInterface } from "../loop"

export const loopJoin = (loop: LoopInterface<unknown>, sep: string, flow: Flow): string => {
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
