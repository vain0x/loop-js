import type { Flow, LoopInterface } from "../loop_types"

export class PrependLoop<T> implements LoopInterface<T> {
  constructor(
    private readonly inner: LoopInterface<T>,
    private readonly item: T,
  ) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    action(this.item)
    if (!flow.running) return
    this.inner.iterate(action, flow)
  }
}
