import type { Flow, LoopInterface } from "../loop"

export class SliceLoop<T> implements LoopInterface<T> {
  constructor(private readonly inner: LoopInterface<T>, private readonly start: number, private readonly end: number) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    let start = this.start
    let end = this.end
    let index = 0

    this.inner.iterate(item => {
      if (index < start) {
        index++
        return
      }
      if (index >= end) {
        flow.running = false
        return
      }
      action(item)
      index++
    }, flow)
  }
}
