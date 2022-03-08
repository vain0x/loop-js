import type { Flow, LoopInterface } from "../loop_types"

export class TakeWhileLoop<T> implements LoopInterface<T> {
  constructor(
    private readonly inner: LoopInterface<T>,
    private readonly predicate: (item: T, index: number) => boolean,
  ) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    let index = 0

    this.inner.iterate(item => {
      if (!this.predicate(item, index++)) {
        flow.running = false
        return
      }
      action(item)
    }, flow)
  }
}
