import type { Flow, LoopInterface } from "../loop_types"

export class TakeLoop<T> implements LoopInterface<T> {
  constructor(private readonly inner: LoopInterface<T>, private readonly count: number) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    let count = this.count

    this.inner.iterate(item => {
      if (count-- <= 0) {
        flow.running = false
        return
      }
      action(item)
    }, flow)
  }
}