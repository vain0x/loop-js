// This is an example that uses basic operations: `map` and `filter`.

import assert from "assert"
import { Loop } from "../src" // "loop-js"

it("example: map_filter", () => {
  // Initially we have an array.
  const array = ["3", ".", "1", "4"]

  const digits = Loop.from(array) // Wrap it
    .map(s => Number.parseInt(s)) // Convert items
    .filter(n => !Number.isNaN(n)) // Drop unnecessary items
    .toArray() // Collect to array

  assert.deepEqual(digits, [3, 1, 4])

  // Note: intermediate array [3, NaN, 1, 4] isn't produced on memory
  //       unlike `array.map().filter()`.
})
