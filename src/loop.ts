import { loopEvery } from "./impl/every"
import { FilterLoop } from "./impl/filter"
import { loopForEach } from "./impl/for_each"
import { FromArrayLoop } from "./impl/from"
import { MapLoop } from "./impl/map"
import { RangeLoop } from "./impl/range"
import { loopReduce } from "./impl/reduce"
import { ReverseLoop } from "./impl/reverse"
import { TakeLoop } from "./impl/take"
import { loopSome } from "./impl/some"
import { loopToArray } from "./impl/to_array"
import { SkipLoop } from "./impl/skip"
import { SliceLoop } from "./impl/slice"

export interface Flow {
  /** Indicates current iteration is still running (not break). */
  running: boolean
}

export interface LoopInterface<T> {
  /**
   * Runs a loop. That is, this function calls the specified action repeatedly.
   *
   * - Mutate `flow.running <- false` to `break` from current iteration.
   */
  iterate(action: (item: T) => void, flow: Flow): void
}

/**
 * Represents an iteration.
 */
export class Loop<T> implements LoopInterface<T> {
  constructor(private readonly inner: LoopInterface<T>) { }

  // implements LoopInterface
  iterate(action: (item: T) => void, flow: Flow): void {
    this.inner.iterate(action, flow)
  }

  // ---------------------------------------------
  // Factories
  // ---------------------------------------------

  /**
   * Creates a loop from `start` to `end` (exclusive).
   *
   * That is, `range(start, end).forEach(f)` is equivalent to:
   *
   * ```ts
   * for (let i = start; i < end; i++) { f(i, i) }
   * ```
   */
  static range(start: number, end: number): Loop<number> {
    return new Loop(new RangeLoop(start, end))
  }

  /** Creates a loop from an array. */
  static fromArray<T>(source: readonly T[]): Loop<T> {
    return new Loop(new FromArrayLoop(source))
  }

  // ---------------------------------------------
  // Combinators
  // ---------------------------------------------

  forEach(action: (item: T, index: number) => void): void {
    loopForEach(this.inner, action, { running: true })
  }

  reduce<S>(reducer: (prev: S, item: T, index: number) => S, initialValue: S): S
  reduce(reducer: (prev: T, item: T, index: number) => T): T
  reduce(reducer: unknown, initialValue?: unknown): unknown {
    return arguments.length === 1
      ? loopReduce(this.inner, reducer as any)
      : loopReduce(this.inner, reducer as any, initialValue as any)
  }

  every(predicate: (item: T, index: number) => boolean): boolean {
    return loopEvery(this.inner, predicate)
  }

  some(predicate: (item: T, index: number) => boolean): boolean {
    return loopSome(this.inner, predicate)
  }

  map<U>(mapping: (item: T, index: number) => U): Loop<U> {
    return new Loop(new MapLoop<T, U>(this.inner, mapping))
  }

  filter(predicate: (item: T, index: number) => boolean): Loop<T> {
    return new Loop(new FilterLoop<T>(this.inner, predicate))
  }

  reverse(): Loop<T> {
    return new Loop(new ReverseLoop<T>(this.inner))
  }

  take(count: number): Loop<T> {
    return new Loop(new TakeLoop<T>(this.inner, count))
  }

  skip(count: number): Loop<T> {
    return new Loop(new SkipLoop<T>(this.inner, count))
  }

  slice(start: number, end: number): Loop<T> {
    return new Loop(new SliceLoop<T>(this.inner, start, end))
  }

  toArray(): T[] {
    return loopToArray(this.inner, { running: true })
  }
}
