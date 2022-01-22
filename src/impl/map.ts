import type { LoopInterface } from "../loop"

export class MapLoop<T, U> implements LoopInterface<U> {
  constructor(
    private readonly source: LoopInterface<T>,
    private readonly mapping: (item: T) => U,
  ) {
  }

  iterate(action: (item: U) => void): void {
    this.source.iterate(item => {
      action(this.mapping(item))
    })
  }
}
