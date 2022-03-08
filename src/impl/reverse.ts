import type { Flow, LoopInterface } from "../loop_types"
import { loopToArray } from "./to_array"

export class ReverseLoop<T> implements LoopInterface<T> {
  constructor(private readonly inner: LoopInterface<T>) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    const output = loopToArray(this.inner)
    for (let i = output.length; i--;) {
      if (!flow.running) return
      action(output[i])
    }
  }
}
