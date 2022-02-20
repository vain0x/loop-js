import type { Flow, LoopInterface } from "../loop_types"

export class SkipLoop<T> implements LoopInterface<T> {
  constructor(private readonly inner: LoopInterface<T>, private readonly count: number) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    let count = this.count

    this.inner.iterate(item => {
      if (--count >= 0) return
      action(item)
    }, flow)
  }
}
