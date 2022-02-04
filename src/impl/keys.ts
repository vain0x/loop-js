import type { Flow, LoopInterface } from "../loop"

export class KeysLoop implements LoopInterface<number> {
  constructor(private readonly source: LoopInterface<unknown>) { }

  iterate(action: (item: number) => void, flow: Flow): void {
    let i = 0
    this.source.iterate(() => {
      action(i++)
    }, flow)
  }
}
