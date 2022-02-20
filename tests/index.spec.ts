import assert, { deepEqual, notEqual, equal } from "assert/strict"
import { Loop } from "../src"
import type { LoopInterface } from "../src/loop_types"

const isError = (value: unknown): value is Error => value instanceof Error

it("range", () => {
  let sum = 0
  Loop.range(0, 10).forEach(i => {
    sum += i
  })
  equal(sum, 45)
})

it("replicate", () => {
  let s = ""
  Loop.replicate("+", 3).forEach(x => {
    s += x
  })
  equal(s, "+++")
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
    Loop.from([
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

it("entries", () => {
  let s = ""
  Loop.range(0, 5).map(i => "abcde"[i]).entries().forEach(([i, x]) => {
    s += `${i}:${x};`
  })
  equal(s, "0:a;1:b;2:c;3:d;4:e;")
})

it("keys", () => {
  equal(Loop.from(new Array(5)).keys().join(","), "0,1,2,3,4")
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

it("at", () => {
  const loop = Loop.range(0, 5).map(i => "abcde"[i])
  equal(loop.at(0), "a")
  equal(loop.at(4), "e")

  equal(loop.at(-1), undefined)
  equal(loop.at(0.5), undefined)
  equal(loop.at(5), undefined)
  equal(loop.at(NaN), undefined)
  equal(loop.at(Infinity), undefined)
})

it("last", () => {
  equal(Loop.range(0, 5).map(i => "abcde"[i]).last(), "e")
  equal(Loop.range(0, 0).last(), undefined)
})

it("count", () => {
  equal(Loop.range(0, 5).count(), 5)
})

it("concat", () => {
  deepEqual(Loop.range(0, 5).concat(Loop.range(0, 3)).toArray(), [0, 1, 2, 3, 4, 0, 1, 2])
})

it("find", () => {
  equal(Loop.range(0, 5).find(x => x === 2), 2)
  equal(Loop.range(0, 5).find(x => x === 5), undefined)
})

it("find (type guard)", () => {
  const e = Loop.from([{}, new Error("error")]).find(isError)
  assert.ok(e != undefined)
  equal(e.message, "error")
})

it("pick", () => {
  equal(Loop.range(0, 5).pick(x => x >= 1 && x % 3 === 0 ? `Fizz(${x})` : undefined), "Fizz(3)")
  equal(Loop.range(0, 5).pick(() => undefined), undefined)
})

it("includes", () => {
  equal(Loop.range(0, 5).includes(1), true)
  equal(Loop.range(0, 5).includes(5), false)
})

it("from (array)", () => {
  Loop.from([]).forEach(() => { throw new Error("not called") })

  let s = ""
  Loop.from([0, 1, 2, 3, 4]).forEach(x => {
    s += `${x};`
  })
  equal(s, "0;1;2;3;4;")
})

it("from (array) - early break", () => {
  let count = 0
  const ok = Loop.from([0, 1, 2, 3, 4]).every(x => {
    count++
    return x < 2
  })
  equal(ok, false)
  equal(count, 3)
})

it("from (loop)", () => {
  const customLoop: LoopInterface<number> = {
    iterate: (action, _flow) => {
      action(3); action(1); action(4)
    }
  }
  equal(Loop.from(customLoop).map(x => x * 2).join(","), "6,2,8")
})

it("generator", () => {
  const customLoop: Loop<number> = Loop.generate(push => {
    push(2); push(7); push(1); push(8)
  })
  deepEqual(customLoop.toArray(), [2, 7, 1, 8])
})

it("generator - early break", () => {
  const powerOfTwo: Loop<number> = Loop.generate((push, flow) => {
    assert.ok(flow.running)
    for (let n = 1; ; n *= 2) {
      push(n)
      if (!flow.running) return
    }
  })
  deepEqual(powerOfTwo.take(3).toArray(), [1, 2, 4])
  deepEqual(powerOfTwo.takeWhile(n => n < 1000).toArray().slice(-1), [512])
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

it("sort", () => {
  equal(Loop.from([3, 1, 4, 1, 5, 9]).sort(compare).join(","), "1,1,3,4,5,9")
})

it("sort (tracing)", () => {
  let s = ""
  equal(
    Loop.from([3, 1, 4, 1, 5, 9])
      .map(x => { s += `+${x};`; return x })
      .sort(compare)
      .filter(x => x !== 1)
      .map(x => { s += `-${x};`; return x })
      .join(","),
    "3,4,5,9",
  )
  // Because `sort` makes a temporal array, all +s lead and -s follow.
  equal(s, "+3;+1;+4;+1;+5;+9;-3;-4;-5;-9;")
})

it("empty", () => {
  deepEqual(Loop.empty().toArray(), [])

  // With type argument list.
  let loop = Loop.empty<number>()
  loop = Loop.from([0])
  deepEqual(loop.toArray(), [0])

  // Type inference.
  deepEqual(Loop.from([1]).concat(Loop.empty()).toArray(), [1])
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

describe("map/set interop", () => {
  it("fromMap", () => {
    const map = new Map([[1, "a"], [2, "b"]])
    equal(Loop.fromMap(map).join(";"), "1,a;2,b")
  })

  it("fromSet", () => {
    const set = new Set([1, 2, 3])
    equal(Loop.fromSet(set).join(";"), "1;2;3")
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

const compare = <T>(a: T, b: T) => a === b ? 0 : (a < b ? -1 : 1)
