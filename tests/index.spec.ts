import assert from "assert"
import { deepEqual, notEqual, equal } from "assert/strict"
import { Loop } from "../src"

const isError = (value: unknown): value is Error => value instanceof Error

it("range", () => {
  let sum = 0
  Loop.range(0, 10).forEach(i => {
    sum += i
  })
  equal(sum, 45)
})

it("forEach", () => {
  let s = ""
  Loop.range(0, 5).map(i => "abcde"[i]).forEach((x, i) => {
    s += `${i}:${x};`
  })
  equal(s, "0:a;1:b;2:c;3:d;4:e;")
})

it("reduce with initial value", () => {
  let s = ""
  const result = Loop.range(0, 5).map(i => "abcde"[i]).reduce((prev, item, index) => {
    s += `${index}:${prev}:${item};`
    return prev + item
  }, "")
  equal(result, "abcde")
  equal(s, "0::a;1:a:b;2:ab:c;3:abc:d;4:abcd:e;")
})

it("reduce without initial value", () => {
  let s = ""
  const result = Loop.range(0, 5).map(i => "abcde"[i]).reduce((prev, item, index) => {
    s += `${index}:${prev}:${item};`
    return prev + item
  })
  equal(result, "abcde")
  equal(s, "1:a:b;2:ab:c;3:abc:d;4:abcd:e;")
})

it("map", () => {
  const xs: number[] = []
  Loop.range(0, 5).map(i => i * 2).forEach(x => {
    xs.push(x)
  })
  equal(xs.join(","), "0,2,4,6,8")
})

it("map with indices", () => {
  let s = ""
  Loop.range(0, 5)
    .map(x => "abcde"[x])
    .map((x, i) => [i, x])
    .forEach(([i, x]) => {
      s += `${i}:${x};`
    })
  equal(s, "0:a;1:b;2:c;3:d;4:e;")
})

it("flatMap", () => {
  let s = ""
  deepEqual(
    Loop.fromArray([
      [0, 1, 2],
      Object.assign(Object.create(Loop.range(3, 5)), { toString: () => "3..5" }),
    ])
      .flatMap((x, i) => {
        s += `${i}:${x};`
        return x
      })
      .toArray(),
    [0, 1, 2, 3, 4],
  )
  equal(s, "0:0,1,2;1:3..5;")
})

it("filter", () => {
  let t = ""
  let s = ""
  Loop.range(0, 5)
    .map(x => "a_c_e"[x])
    .filter((x, i) => {
      t += `${i}:${x};`
      return x !== "_"
    })
    .forEach((x, i) => { s += `${i}:${x};` })
  equal(s, "0:a;1:c;2:e;")
  equal(t, "0:a;1:_;2:c;3:_;4:e;")
})

it("choose", () => {
  let s = ""
  deepEqual(
    Loop.range(0, 5)
      .map(x => "a_c_e"[x])
      .choose((x, i) => {
        s += `${i}:${x};`
        return x !== "_" ? x.toUpperCase() : undefined
      })
      .toArray(),
    ["A", "C", "E"],
  )
  equal(s, "0:a;1:_;2:c;3:_;4:e;")
})

it("every", () => {
  equal(Loop.range(0, 5).every(x => x < 5), true)
  equal(Loop.range(0, 5).every(x => x < 2), false)
})

it("every early break", () => {
  let s = ""
  const ok = Loop.range(0, 5).every(x => {
    s += `${x};`
    return x < 2
  })
  equal(ok, false)
  equal(s, "0;1;2;")
})

it("map+every early break (2)", () => {
  let s = ""
  const ok = Loop.range(0, 5).map(x => {
    s += `${x};`
    return x + 1
  }).every(x => x < 2)
  equal(ok, false)
  equal(s, "0;1;")
})

it("some", () => {
  equal(Loop.range(0, 5).some(x => x === 4), true)
  equal(Loop.range(0, 5).some(x => x === 5), false)
})

it("reverse", () => {
  deepEqual(Loop.range(0, 5).reverse().toArray(), [4, 3, 2, 1, 0])

  let n = 0
  equal(Loop.range(0, 5).reverse().every(x => {
    n++
    return x >= 3
  }), false)
  equal(n, 3)
})

it("take", () => {
  deepEqual(Loop.range(0, 5).take(0).toArray(), [])
  deepEqual(Loop.range(0, 5).take(3).toArray(), [0, 1, 2])
  deepEqual(Loop.range(0, 5).take(5).toArray(), [0, 1, 2, 3, 4])
})

it("take extreme values", () => {
  // take(negative) and take(NaN) are empty.
  deepEqual(Loop.range(0, 5).take(-1).every(() => false), true)
  deepEqual(Loop.range(0, 5).take(-Infinity).every(() => false), true)
  deepEqual(Loop.range(0, 5).take(NaN).toArray().length, 5)

  // take(infinity) is full.
  deepEqual(Loop.range(0, 5).take(Infinity).toArray().length, 5)
})

it("skip", () => {
  deepEqual(Loop.range(0, 5).skip(0).toArray(), [0, 1, 2, 3, 4])
  deepEqual(Loop.range(0, 5).skip(3).toArray(), [3, 4])
  deepEqual(Loop.range(0, 5).skip(5).toArray(), [])
})

it("skip extreme values", () => {
  // skip(negative) and skip(NaN) are full.
  deepEqual(Loop.range(0, 5).skip(-1).toArray(), [0, 1, 2, 3, 4])
  deepEqual(Loop.range(0, 5).skip(-Infinity).toArray(), [0, 1, 2, 3, 4])
  deepEqual(Loop.range(0, 5).skip(NaN).toArray(), [0, 1, 2, 3, 4])

  // skip(infinity) is empty.
  deepEqual(Loop.range(0, 5).skip(Infinity).toArray(), [])
})

it("takeWhile", () => {
  let s = ""
  deepEqual(Loop.range(0, 5).map(i => "abcde"[i]).takeWhile((x, i) => {
    s += `${i}:${x};`
    return i % 3 !== 2
  }).toArray(), ["a", "b"])
  equal(s, "0:a;1:b;2:c;")
})

it("skipWhile", () => {
  let s = ""
  deepEqual(Loop.range(0, 5).map(i => "abcde"[i]).skipWhile((x, i) => {
    s += `${i}:${x};`
    return i % 3 !== 2
  }).toArray(), ["c", "d", "e"])
  equal(s, "0:a;1:b;2:c;")
})

it("slice", () => {
  deepEqual(Loop.range(0, 5).slice(1, 4).toArray(), [1, 2, 3])

  // Reversed interval.
  deepEqual(Loop.range(0, 5).slice(4, 1).toArray(), [])

  // FIXME: Negative indices.
  // deepEqual(Loop.range(0, 5).slice(-1).toArray(), [4])
})

it("slice extreme values", () => {
  deepEqual(Loop.range(0, 5).slice(-Infinity, Infinity).toArray(), [0, 1, 2, 3, 4])
})

it("find", () => {
  equal(Loop.range(0, 5).find(x => x === 2), 2)
  equal(Loop.range(0, 5).find(x => x === 5), undefined)
})

it("find (type guard)", () => {
  const e = Loop.fromArray([{}, new Error("error")]).find(isError)
  assert.ok(e != undefined)
  equal(e.message, "error")
})

it("pick", () => {
  equal(Loop.range(0, 5).pick(x => x >= 1 && x % 3 === 0 ? `Fizz(${x})` : undefined), "Fizz(3)")
  equal(Loop.range(0, 5).pick(() => undefined), undefined)
})

it("fromArray", () => {
  Loop.fromArray([]).forEach(() => { throw new Error("not called") })

  let s = ""
  Loop.fromArray([0, 1, 2, 3, 4]).forEach(x => {
    s += `${x};`
  })
  equal(s, "0;1;2;3;4;")
})

it("fromArray early break", () => {
  let count = 0
  const ok = Loop.fromArray([0, 1, 2, 3, 4]).every(x => {
    count++
    return x < 2
  })
  equal(ok, false)
  equal(count, 3)
})

it("toArray", () => {
  const array = Loop.range(0, 5).toArray()
  deepEqual(array, [0, 1, 2, 3, 4])
})

it("toArray freshness", () => {
  notEqual(Loop.range(0, 0).toArray(), Loop.range(0, 0).toArray())
})

it("join", () => {
  equal(Loop.range(0, 5).join(), "01234")
  equal(Loop.range(0, 5).join(","), "0,1,2,3,4")

  equal(Loop.range(0, 0).join(","), "")
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
      loop.forEach(x => xs.push(x))
      equal(count, 5 * (i + 1))

      equal(xs.join(","), "0,2,4,6,8")
    }
  })
})

describe("iterator interop", () => {
  it("fromIterable", () => {
    const iterable: Iterable<string> = {
      [Symbol.iterator]: () => "abc"[Symbol.iterator]()
    }
    const loop = Loop.fromIterable(iterable)
    equal(loop.join(","), "a,b,c")

    // Iterable is reusable.
    equal(loop.toArray().join(","), "a,b,c")
  })

  it("fromIterator", () => {
    const iterator: Iterator<string> = "abc"[Symbol.iterator]()
    const loop = Loop.fromIterator(iterator)
    equal(loop.join(","), "a,b,c")

    // Iterator isn't reusable.
    deepEqual(loop.toArray(), [])
  })
})
