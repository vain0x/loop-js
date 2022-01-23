import type { Flow, LoopInterface } from "../loop"

export class FilterLoop<T> implements LoopInterface<T> {
  constructor(
    private readonly source: LoopInterface<T>,
    private readonly predicate: (item: T, index: number) => boolean,
  ) {
  }

  iterate(action: (item: T) => void, flow: Flow): void {
    let index = 0
    this.source.iterate(item => {
      if (this.predicate(item, index++)) {
        action(item)
      }
    }, flow)
  }
}
