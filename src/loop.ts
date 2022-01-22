import { loopForEach } from "./impl/for_each"
import { MapLoop } from "./impl/map"
import { RangeLoop } from "./impl/range"

export interface LoopInterface<T> {
  /**
   * Runs a loop. That is, this function calls the specified action repeatedly.
   */
  iterate(action: (item: T) => void): void
}

/**
 * Represents an iteration.
 */
export class Loop<T> implements LoopInterface<T> {
  constructor(private readonly inner: LoopInterface<T>) { }

  // implements LoopInterface
  iterate(action: (item: T) => void): void {
    this.inner.iterate(action)
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

  // ---------------------------------------------
  // Combinators
  // ---------------------------------------------

  forEach(action: (item: T, index: number) => void): void {
    loopForEach(this.inner, action)
  }

  map<U>(mapping: (item: T, index: number) => U): Loop<U> {
    return new Loop(new MapLoop<T, U>(this, mapping))
  }
}
