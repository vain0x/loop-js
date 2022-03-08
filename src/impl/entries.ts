import type { Flow, LoopInterface } from "../loop_types"

export class EntriesLoop<T> implements LoopInterface<readonly [number, T]> {
  constructor(
    private readonly source: LoopInterface<T>,
  ) {
  }

  iterate(action: (item: readonly [number, T]) => void, flow: Flow): void {
    const pair: [number, T] = [0, undefined!]
    this.source.iterate(item => {
      pair[1] = item
      action(pair)
      pair[0]++
    }, flow)
  }
}
