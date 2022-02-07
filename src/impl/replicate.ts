import type { Flow, LoopInterface } from "../loop"

export class ReplicateLoop<T> implements LoopInterface<T> {
  constructor(private readonly item: T, private readonly count: number) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    for (let i = 0, n = this.count; i < n; i++) {
      action(this.item)
      if (!flow.running) return
    }
  }
}
