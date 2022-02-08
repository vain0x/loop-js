// Example of making custom Loop class.

// By making customized `Loop` class
// tree-shaking (dead-code elimination) works better.

import assert from "assert"
import type { Flow, LoopInterface } from "../src/loop" // "loop-js/loop"
import { FromArrayLoop } from "../src/impl/from_array" // "loop-js/impl/from_array"
import { loopEvery } from "../src/impl/every" // "loop-js/impl/every"

class Loop<T> implements LoopInterface<T> {
  constructor(readonly inner: LoopInterface<T>) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    this.inner.iterate(action, flow)
  }

  static from<T>(array: readonly T[]): Loop<T> {
    return new Loop(new FromArrayLoop(array))
  }

  every(predicate: (item: T, index: number) => boolean): boolean {
    return loopEvery(this.inner, predicate)
  }
}

it("custom loop", () => {
  assert.ok(Loop.from([0, 1, 2]).every(x => x < 3))
})
