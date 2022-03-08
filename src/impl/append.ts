import type { Flow, LoopInterface } from "../loop_types"

export class AppendLoop<T> implements LoopInterface<T> {
  constructor(
    private readonly inner: LoopInterface<T>,
    private readonly item: T,
  ) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    this.inner.iterate(action, flow)
    if (!flow.running) return
    action(this.item)
  }
}
