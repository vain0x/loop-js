import type { Flow, LoopInterface } from "../loop_types"

export class ChooseLoop<T, U> implements LoopInterface<U> {
  constructor(
    private readonly source: LoopInterface<T>,
    private readonly chooser: (item: T, index: number) => U | undefined,
  ) {
  }

  iterate(action: (item: U) => void, flow: Flow): void {
    let index = 0
    this.source.iterate(item => {
      const result = this.chooser(item, index++)
      if (result !== undefined) {
        action(result)
      }
    }, flow)
  }
}
