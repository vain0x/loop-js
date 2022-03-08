import type { Flow, LoopInterface } from "../loop_types"
import { FromArrayLoop } from "./from_array"
import { loopToArray } from "./to_array"

export class SortLoop<T> implements LoopInterface<T> {
  constructor(
    readonly source: LoopInterface<T>,
    readonly compare: ((a: T, b: T) => number )| undefined,
  ) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    new FromArrayLoop(loopToArray(this.source)
      .sort(this.compare))
      .iterate(action, flow)
  }
}
