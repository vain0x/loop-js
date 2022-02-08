// Example of adding custom operator.

import assert from "assert"
import { Loop } from "../src/loop" // "loop-js"

// Extend `Loop<T>` type.
declare module "../src/loop" { // "loop-js"
  interface Loop<T> {
    void(): Loop<void>
  }
}

// Define method.
Loop.prototype.void = function <T>(this: Loop<T>) {
  return this.map(() => undefined)
}

it("custom operator", () => {
  const array = Loop.range(0, 3).void().toArray()
  //                             ^^^^
  //                             using

  assert.deepEqual(array, [undefined, undefined, undefined])
})
