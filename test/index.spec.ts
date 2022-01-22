import { equal } from "assert/strict"
import { Loop } from "../src"

it("range", () => {
  let sum = 0
  Loop.range(0, 10).iterate(i => {
    sum += i
  })
  equal(sum, 45)
})
