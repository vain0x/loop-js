import assert from "assert"
import { Loop } from "../src" // "loop-js"

it("fizzBuzz", () => {
  const array = Loop.range(1, 16)
    .map(i => {
      if (i % 15 === 0) {
        return "FizzBuzz"
      } else if (i % 3 === 0) {
        return "Fizz"
      } else if (i % 5 === 0) {
        return "Buzz"
      } else {
        return i.toString()
      }
    })
    .toArray()

  assert.deepEqual(array, [
    1,
    2,
    "Fizz",
    4,
    "Buzz",
    "Fizz",
    7,
    8,
    "Fizz",
    "Buzz",
    11,
    "Fizz",
    13,
    14,
    "FizzBuzz",
  ])
})
