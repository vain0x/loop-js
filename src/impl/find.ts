import type { Flow, LoopInterface } from "../loop"

export function loopFind<T, S extends T>(loop: LoopInterface<T>, predicate: (value: T, index: number) => value is S, flow: Flow): S | undefined
export function loopFind<T>(loop: LoopInterface<T>, predicate: (value: T, index: number) => unknown, flow: Flow): T | undefined
export function loopFind(loop: LoopInterface<unknown>, predicate: (value: unknown, index: number) => unknown, flow: Flow): unknown {
  let index = 0
  let found: unknown
  loop.iterate(item => {
    if (predicate(item, index++)) {
      found = item
      flow.running = false
    }
  }, flow)
  return found
}
