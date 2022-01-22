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

it("map with indices", () => {
  let s = ""
  Loop.range(0, 5)
    .map(x => "abcde"[x])
    .map((x, i) => [i, x])
    .iterate(([i, x]) => {
      s += `${i}:${x};`
    })
  equal(s, "0:a;1:b;2:c;3:d;4:e;")
})

describe("white-box", () => {
  it("reused loop object should work", () => {
    // Count of calls to the mapping.
    let count = 0

    const loop = Loop.range(0, 5).map(i => {
      count++
      return i * 2
    })

    for (let i = 0; i < 2; i++) {
      const xs: number[] = []

      // Reuse pre-built loop object.
      loop.iterate(x => xs.push(x))
      equal(count, 5 * (i + 1))

      equal(xs.join(","), "0,2,4,6,8")
    }
  })
})
