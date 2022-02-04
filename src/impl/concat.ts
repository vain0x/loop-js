import type { Flow, LoopInterface } from "../loop"
import { loopFrom, LoopSource } from "./from"

export class ConcatLoop<T> implements LoopInterface<T> {
  constructor(
    private readonly first: LoopInterface<T>,
    private readonly second: LoopSource<T>,
  ) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    this.first.iterate(action, flow)
    if (!flow.running) return
    loopFrom(this.second).iterate(action, flow)
  }
}
