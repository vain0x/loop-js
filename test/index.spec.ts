import { equal } from "assert/strict"
import { Loop } from "../src"

it("range", () => {
  let sum = 0
  Loop.range(0, 10).iterate(i => {
    sum += i
  })
  equal(sum, 45)
})

it("map", () => {
  const xs: number[] = []
  Loop.range(0, 5).map(i => i * 2).iterate(x => {
    xs.push(x)
  })
  equal(xs.join(","), "0,2,4,6,8")
})
