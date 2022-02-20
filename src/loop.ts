import type { LoopInterface, Flow } from "./loop_types"
import { loopEvery } from "./impl/every"
import { FilterLoop } from "./impl/filter"
import { loopForEach } from "./impl/for_each"
import { MapLoop } from "./impl/map"
import { RangeLoop } from "./impl/range"
import { loopReduce } from "./impl/reduce"
import { ReverseLoop } from "./impl/reverse"
import { TakeLoop } from "./impl/take"
import { loopSome } from "./impl/some"
import { loopToArray } from "./impl/to_array"
import { SkipLoop } from "./impl/skip"
import { SliceLoop } from "./impl/slice"
import { loopJoin } from "./impl/join"
import { loopFind } from "./impl/find"
import { TakeWhileLoop } from "./impl/take_while"
import { SkipWhileLoop } from "./impl/skip_while"
import { loopPick } from "./impl/pick"
import { ChooseLoop } from "./impl/choose"
import { FlatMapLoop } from "./impl/flat_map"
import { FromIterableLoop, FromIteratorLoop } from "./impl/from_iterable"
import { loopFrom, LoopSource } from "./impl/from"
import { SortLoop } from "./impl/sort"
import { EntriesLoop } from "./impl/entries"
import { KeysLoop } from "./impl/keys"
import { ConcatLoop } from "./impl/concat"
import { loopIncludes } from "./impl/includes"
import { ReplicateLoop } from "./impl/replicate"
import { FromMapLoop, FromSetLoop } from "./impl/from_map"
import { loopAt } from "./impl/at"

/**
 * Represents an iteration.
 */
export class Loop<T> implements LoopInterface<T> {
  constructor(readonly inner: LoopInterface<T>) { }

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

  static replicate<T>(item: T, count: number): Loop<T> {
    return new Loop(new ReplicateLoop(item, count))
  }

  static from<T>(source: LoopSource<T>): Loop<T> {
    return source instanceof Loop ? source : new Loop(loopFrom(source))
  }

  static fromSet<T>(set: Set<T>): Loop<T> {
    return new Loop(new FromSetLoop(set))
  }

  static fromMap<K, T>(map: Map<K, T>): Loop<readonly [K, T]> {
    return new Loop(new FromMapLoop(map))
  }

  static fromIterable<T>(iterable: Iterable<T>): Loop<T> {
    return new Loop(new FromIterableLoop(iterable))
  }

  static fromIterator<T>(iterator: Iterator<T>): Loop<T> {
    return new Loop(new FromIteratorLoop(iterator))
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

  flatMap<U>(mapping: (item: T, index: number) => LoopInterface<U> | readonly U[]): Loop<U> {
    return new Loop(new FlatMapLoop<T, U>(this.inner, mapping))
  }

  filter(predicate: (item: T, index: number) => boolean): Loop<T> {
    return new Loop(new FilterLoop<T>(this.inner, predicate))
  }

  choose<U>(chooser: (item: T, index: number) => U | undefined): Loop<U> {
    return new Loop(new ChooseLoop<T, U>(this.inner, chooser))
  }

  reverse(): Loop<T> {
    return new Loop(new ReverseLoop<T>(this.inner))
  }

  entries(): Loop<readonly [number, T]> {
    return new Loop(new EntriesLoop(this.inner))
  }

  keys(): Loop<number> {
    return new Loop(new KeysLoop(this.inner))
  }

  take(count: number): Loop<T> {
    return new Loop(new TakeLoop<T>(this.inner, count))
  }

  skip(count: number): Loop<T> {
    return new Loop(new SkipLoop<T>(this.inner, count))
  }

  takeWhile(predicate: (item: T, index: number) => boolean): Loop<T> {
    return new Loop(new TakeWhileLoop<T>(this.inner, predicate))
  }

  skipWhile(predicate: (item: T, index: number) => boolean): Loop<T> {
    return new Loop(new SkipWhileLoop<T>(this.inner, predicate))
  }

  slice(start: number, end: number): Loop<T> {
    return new Loop(new SliceLoop<T>(this.inner, start, end))
  }

  at(index: number): T | undefined {
    return loopAt(this.inner, index)
  }

  concat(other: LoopSource<T>): Loop<T> {
    return new Loop(new ConcatLoop(this.inner, other))
  }

  toArray(): T[] {
    return loopToArray(this.inner, { running: true })
  }

  join(sep?: string): string {
    return loopJoin(this.inner, sep ?? "", { running: true })
  }

  find<S extends T>(predicate: (value: T, index: number) => value is S): S | undefined
  find(predicate: (value: T, index: number) => unknown): T | undefined
  find(predicate: (value: T, index: number) => unknown): unknown {
    return loopFind(this.inner, predicate, { running: true })
  }

  pick<U>(picker: (value: T, index: number) => U | undefined): U | undefined {
    return loopPick(this.inner, picker, { running: true })
  }

  includes(searchElement: T): boolean {
    return loopIncludes(this.inner, searchElement)
  }

  sort(compare?: (x: T, y: T) => number): Loop<T> {
    return new Loop(new SortLoop(this.inner, compare))
  }
}
