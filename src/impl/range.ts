import type { LoopInterface } from "../loop"

export class RangeLoop implements LoopInterface<number> {
  constructor(private readonly start: number, private readonly end: number) { }

  iterate(action: (item: number) => void): void {
    for (let i = this.start; i < this.end; i++) {
      action(i)
    }
  }
}
