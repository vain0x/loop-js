import type { Flow, LoopInterface } from "../loop"

export class FlatMapLoop<T, U> implements LoopInterface<U> {
  constructor(
    private readonly source: LoopInterface<T>,
    private readonly mapping: (item: T, index: number) => LoopInterface<U> | readonly U[],
  ) {}

  iterate(action: (item: U) => void, flow: Flow): void {
    let index = 0
    this.source.iterate(item => {
      const chunk = this.mapping(item, index++)

      if ("iterate" in chunk) {
        chunk.iterate(action, flow)
      } else {
        for (let i = 0, n = chunk.length; i < n; i++) {
          action(chunk[i])
        }
      }
    }, flow)
  }
}
