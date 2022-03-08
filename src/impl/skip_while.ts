import type { Flow, LoopInterface } from "../loop_types"

export class SkipWhileLoop<T> implements LoopInterface<T> {
  constructor(
    private readonly inner: LoopInterface<T>,
    private readonly predicate: (item: T, index: number) => boolean,
  ) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    let skipping = true
    let index = 0

    this.inner.iterate(item => {
      if (skipping) {
        if (this.predicate(item, index++)) {
          return
        }
        skipping = false
      }
      action(item)
    }, flow)
  }
}
