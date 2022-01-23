import type { Flow, LoopInterface } from "../loop"

export const loopToArray = <T>(loop: LoopInterface<T>, flow: Flow) => {
  const output: T[] = []
  loop.iterate(item => { output.push(item) }, flow)
  return output
}
