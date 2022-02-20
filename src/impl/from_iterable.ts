import type { Flow, LoopInterface } from "../loop_types"

export class FromIterableLoop<T> implements LoopInterface<T> {
  constructor(private readonly inner: Iterable<T>) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    const inner = this.inner
    for (const item of inner) {
      action(item)
      if (!flow.running) return
    }
  }
}

export class FromIteratorLoop<T> implements LoopInterface<T> {
  constructor(private readonly inner: Iterator<T>) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    const iter = this.inner
    while (true) {
      const r = iter.next()
      if (r.done) return
      action(r.value)
      if (!flow.running) return
    }
  }
}
