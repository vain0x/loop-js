import type { Flow, LoopInterface } from "../loop_types"

export class MapLoop<T, U> implements LoopInterface<U> {
  constructor(
    private readonly source: LoopInterface<T>,
    private readonly mapping: (item: T, index: number) => U,
  ) {
  }

  iterate(action: (item: U) => void, flow: Flow): void {
    let index = 0
    this.source.iterate(item => {
      action(this.mapping(item, index++))
    }, flow)
  }
}
