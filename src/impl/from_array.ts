import type { Flow, LoopInterface } from "../loop"

export class FromArrayLoop<T> implements LoopInterface<T> {
  constructor(private readonly inner: readonly T[]) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    const inner = this.inner
    for (let i = 0; i < inner.length; i++) {
      action(inner[i])
      if (!flow.running) return
    }
  }
}
