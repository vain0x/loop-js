# Loop.js

*Loop.js* provides an efficient abstraction of iteration.

API is similar to *Iterator*, however, *Loop* is slightly restricted yet more efficient.

## Install

WIP: not published to npm yet

## Motivation

*Iterator* interface is by design generates garbages in the order of iteration. That adds GC pressure. The design is necessary for its flexibility. However, most of iteration doesn't require such level of flexibility (in my personal opinion).

*Loop* is less flexible but enough to cover most of use-cases, and more efficient than Iterator.

## What is Loop?

`Loop` is an abstraction of an iteration. `Loop` is basically a function that calls a given action repeatedly.

```ts
// Simplified definition.
type Loop<T> = (action: (item: T) => void) => void
```

For example, we can define a `Loop` that represent an iteration over integers in a range.

```ts
const range = (start: number, end: number): Loop<number> =>
  action => {
    for (let i = start; i < end; i++) {
      action(i)
    }
  }
// abstracts "for (let i = start; i < end; i++)".
```

Call it by passing in an action, which is body of the loop, to run.

```ts
  const loop = range(0, 3)
  loop(i => { console.log(i) })
  // does "for (let i = 0; i < 3; i++) { console.log(i) }".
```

Key point is that no objects are allocated inside the body of iteration. Allocated objects, a loop object and a closure, are outside.

### Method-chain API

See src/loop.ts for actual implementation. `Loop` is a class for method-chain.

```ts
  Loop.range(0, 10)
    .map(i => i * i)
    .filter(i => i % 2 === 0)
    .forEach(n => { console.log(n) })
```

### Breaking from loop

Simplified definition written above can't `break` from a loop. In actual implementation, loop function takes another object, `flow`, which signals when loop is broken.

```ts
// Simplified definition. (Updated)
type Loop<T> = (action: (item: T) => void, flow: { running: boolean }) => void
```

Typical operation that breaks the loop is `take`. It only takes a particular number of items at first.

```ts
  Loop.range(0, 10)
    .take(3)
    .forEach(n => { console.log(n) })
  // => 0, 1, 2
```

Potential implementation of `take` sets `false` to `flow.running` to propagate `break` to up when specified number of items have occurred.

```ts
const take = <T>(source: Loop<T>, count: number): Loop<T> =>
  (action, flow) => {
    let index = 0
    source(item => {
      action(item)
      index++
      if (index === count) {
        flow.running = false
      }
    }, flow)
  }
```

And then `range` checks `flow.running` to be cooperative.

```ts
const range = (start: number, end: number): Loop<number> =>
  (action, flow) => {
    for (let i = start; i < end; i++) {
      action(i)
      if (!flow.running) return // <- added
    }
  }
```

### Restriction

`Loop` is NOT a drop-in replacement of Iterator. Especially, Loop can't support `zip`.

## Micro benchmark

See scripts/micro_benchmark.ts .

Each case prints two lines, time and heap memory delta. Result on my machine:

    regular-for: 7.081ms
    regular-for: 129.88KB
    for-of-array: 83.479ms
    for-of-array: 2083.008KB
    for-of-generator: 150.807ms
    for-of-generator: 2084.704KB
    loop-each: 39.028ms
    loop-each: 182.68KB

- `regular-for` was perfectly efficient.
- `for-of-array` and `for-of-generator` were slower and consumed memory much.
- `loop-each` was good as you see.
