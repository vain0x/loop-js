import type { Flow, LoopInterface, LoopSource } from "./loop_types"
import { loopEvery } from "./impl/every"
import { FilterLoop } from "./impl/filter"
import { loopForEach } from "./impl/for_each"
import { MapLoop } from "./impl/map"
import { RangeLoop } from "./impl/range"
import { loopReduce } from "./impl/reduce"
import { ReverseLoop } from "./impl/reverse"
import { loopSome } from "./impl/some"
import { loopToArray } from "./impl/to_array"
import { SliceLoop } from "./impl/slice"
import { loopJoin } from "./impl/join"
import { loopFind } from "./impl/find"
import { TakeWhileLoop } from "./impl/take_while"
import { SkipWhileLoop } from "./impl/skip_while"
import { loopPick } from "./impl/pick"
import { ChooseLoop } from "./impl/choose"
import { FlatMapLoop } from "./impl/flat_map"
import { FromIterableLoop } from "./impl/from_iterable"
import { loopFrom } from "./impl/from"
import { SortLoop } from "./impl/sort"
import { EntriesLoop } from "./impl/entries"
import { KeysLoop } from "./impl/keys"
import { ConcatLoop } from "./impl/concat"
import { loopIncludes } from "./impl/includes"
import { ReplicateLoop } from "./impl/replicate"
import { FromMapLoop, FromSetLoop } from "./impl/from_map"
import { loopAt } from "./impl/at"
import { loopCount } from "./impl/count"
import { loopLast } from "./impl/last"
import { PrependLoop } from "./impl/prepend"
import { AppendLoop } from "./impl/append"
import { EMPTY_LOOP } from "./impl/empty"

/** Represents an iteration and supports method-chain API. */
export class Loop<T> implements LoopInterface<T> {
  constructor(readonly inner: LoopInterface<T>) { }

  // implements LoopInterface
  /** *Just for the internal use.* Consider `forEach` instead. */
  iterate(action: (item: T) => void, flow: Flow): void {
    this.inner.iterate(action, flow)
  }

  // ---------------------------------------------
  // Factories
  // ---------------------------------------------

  /**
   * Creates a loop from `start` to `end` (exclusive).
   *
   * ## Behavior
   *
   * `Loop.range(start, end).forEach(action)` is equivalent to:
   *
   * ```ts
   *  for (let i = start; i < end; i++) {
   *      action(i)
   *  }
   * ```
   */
  static range(start: number, end: number): Loop<number> {
    return new Loop(new RangeLoop(start, end))
  }

  /**
   * Creates a loop with the specified number of `item`s.
   *
   * ## Remark
   *
   * Items are all referentially same.
   * Consider `range(0, count).map(() => [])` to create multiple items.
   *
   * ## Behavior
   *
   * `Loop.replicate(item, count).forEach(action)` is equivalent to:
   *
   * ```ts
   *  for (let i = 0; i < count; i++) {
   *      action(item)
   *  }
   * ```
   */
  static replicate<T>(item: T, count: number): Loop<T> {
    return new Loop(new ReplicateLoop(item, count))
  }

  /**
   * Creates a loop that wraps an array.
   *
   * ## Behavior
   *
   * `Loop.from(array).forEach(action)` is equivalent to:
   *
   * ```ts
   *  for (const item of array) {
   *    action(item)
   *  }
   * ```
   */
  static from<T>(source: LoopSource<T>): Loop<T> {
    return source instanceof Loop ? source : new Loop(loopFrom(source))
  }

  /**
   * Creates a loop that wraps a Set.
   *
   * ## Behavior
   *
   * `Loop.fromSet(set).forEach(action)` is equivalent to:
   *
   * ```ts
   *  set.forEach(action)
   * ```
   */
  static fromSet<T>(set: Set<T>): Loop<T> {
    return new Loop(new FromSetLoop(set))
  }

  /**
   * Creates a loop that wraps a Map.
   *
   * ## Behavior
   *
   * `Loop.fromMap(map).forEach(action)` is equivalent to:
   *
   * ```ts
   *  map.forEach(action)
   * ```
   */
  static fromMap<K, T>(map: Map<K, T>): Loop<readonly [K, T]> {
    return new Loop(new FromMapLoop(map))
  }

  /**
   * *Only for niche use cases.*
   *
   * Creates a loop that wraps an iterable.
   *
   * ## Remark
   *
   * Running an iterator might mutate internal state of iterable.
   * That is, reusing the specified iterable is cautious.
   * Running produced loop more than once might not work as expected.
   */
  static fromIterable<T>(iterable: Iterable<T>): Loop<T> {
    return new Loop(new FromIterableLoop(iterable))
  }

  /**
   * Creates a loop from a function.
   *
   * The specified function must check `flow.running`
   * after each `yield` to stop the loop
   * so that loop methods work correctly.
   */
  static generate<T>(generator: (yielder: (item: T) => void, flow: Flow) => void): Loop<T> {
    return new Loop({ iterate: generator })
  }

  /** Gets an empty loop. */
  static empty<T = never>(): Loop<T> {
    return EMPTY
  }

  /**
   * Creates a loop made from the specified items.
   *
   * ## Behavior
   *
   * `Loop.create(arg0, arg1, ..., argN).forEach(action)` is equivalent to:
   *
   * ```ts
   *  action(arg0)
   *  action(arg1)
   *  ...
   *  action(argN)
   * ```
   */
  static create<T = never>(...args: T[]): Loop<T> {
    return new Loop(loopFrom(args))
  }

  // ---------------------------------------------
  // Combinators
  // ---------------------------------------------

  /**
   * Runs the loop to call a function for each item.
   *
   * Hint: Typically you want feed a closure:
   *
   * ```ts
   *  loop.forEach((item, index) => {
   *      console.log(item, index)
   *  })
   * ```
   *
   * - Similar to `Array.prototype.forEach`.
   */
  forEach(action: (item: T, index: number) => void): void {
    loopForEach(this.inner, action)
  }

  /**
   * Runs the loop to compute a value by accumulating binary operation from left to right.
   *
   * ## Remark
   *
   * To use the overload without `initialValue`, loop mustn't be empty.
   *
   * ## Example
   *
   * Compute a sum of items (`(((0 + a1) + a2) + ...) + aN`).
   *
   * ```ts
   *  loop.reduce((current, item) => current + item, 0)
   * ```
   *
   * ## Behavior
   *
   * - Similar to `Array.prototype.reduce`.
   *
   * ### With initialValue
   *
   * `this.reduce(reducer, initialValue)` is equivalent to:
   *
   * ```ts
   *  let current = initialValue
   *  for (const item of ...) {
   *      current = reducer(current, item)
   *  }
   *  return current
   * ```
   *
   * ### Without initialValue
   *
   * `this.reduce(reducer)` is equivalent to:
   *
   * ```ts
   *  let current
   *  let empty = true
   *  for (const item of ...) {
   *      if (empty) {
   *          current = item
   *          empty = false
   *      } else {
   *          current = reducer(current, item)
   *      }
   *  }
   *  if (empty) throw new Error("loop is empty")
   *  return current
   * ```
   */
  reduce<S>(reducer: (prev: S, item: T, index: number) => S, initialValue: S): S
  reduce(reducer: (prev: T, item: T, index: number) => T): T
  reduce(reducer: unknown, initialValue?: unknown): unknown {
    return arguments.length === 1
      ? loopReduce(this.inner, reducer as any)
      : loopReduce(this.inner, reducer as any, initialValue as any)
  }

  /**
   * Runs the loop to determine whether all items satisfy
   * the specified predicate.
   *
   * - Similar to `Array.prototype.every`.
   * - Returns `true` if empty.
   */
  every(predicate: (item: T, index: number) => boolean): boolean {
    return loopEvery(this.inner, predicate)
  }

  /**
   * Runs the loop to determine whether there is an item
   * that satisfies the specified predicate.
   *
   * - Similar to `Array.prototype.some`.
   * - Returns `false` if empty.
   */
  some(predicate: (item: T, index: number) => boolean): boolean {
    return loopSome(this.inner, predicate)
  }

  /**
   * Creates a loop that maps each item.
   *
   * - Similar to `Array.prototype.map`.
   */
  map<U>(mapping: (item: T, index: number) => U): Loop<U> {
    return new Loop(new MapLoop<T, U>(this.inner, mapping))
  }

  /**
   * *Experimental*: This API might change in next version.
   *
   * Creates a loop that maps each item and flats them.
   * Mapping must return a flatable value; an array or a loop.
   *
   * - Similar to `Array.prototype.flatMap` but different.
   *    This function doesn't work *deeply*.
   */
  flatMap<U>(mapping: (item: T, index: number) => LoopInterface<U> | readonly U[]): Loop<U> {
    return new Loop(new FlatMapLoop<T, U>(this.inner, mapping))
  }

  /**
   * Creates a loop that selects only items
   * that satisfy the specified predicate.
   *
   * - Same as `Array.prototype.filter`.
   * - Hint: map + filter = choose.
   */
  filter(predicate: (item: T, index: number) => boolean): Loop<T> {
    return new Loop(new FilterLoop<T>(this.inner, predicate))
  }

  /**
   * *Experimental*: This API might change in next version.
   *
   * Creates a loop that maps each item
   * and selects only non-undefined values.
   *
   * - Equivalent to `loop.map(mapping).filter(item => item !== undefined)`.
   *    Noting that `null`s are preserved.
   */
  choose<U>(chooser: (item: T, index: number) => U | undefined): Loop<U> {
    return new Loop(new ChooseLoop<T, U>(this.inner, chooser))
  }

  /**
   * Creates a loop that enumerates all items in the reversed order.
   *
   * ## Behavior
   *
   * Similar to but different than `Array.prototype.reverse`
   * This function doesn't affect the loop itself.
   *
   * *Buffering*: The underlying loop doesn't stop. An intermediate array is created.
   *
   * Equivalent to:
   *
   * ```ts
   *  Loop.generate(action => {
   *      const array = loop.toArray()
   *      array.reverse()
   *      array.forEach(action)
   *  })
   * ```
   */
  reverse(): Loop<T> {
    return new Loop(new ReverseLoop<T>(this.inner))
  }

  /**
   * Creates a loop that wraps each item with indices.
   *
   * - Similar to `Array.prototype.entries`
   *    except for this function produces a loop rather than iterator.
   * - Equivalent to `loop.map((item, i) => [i, item])`.
   */
  entries(): Loop<readonly [number, T]> {
    return new Loop(new EntriesLoop(this.inner))
  }

  /**
   * Creates a loop that maps each item with index.
   *
   * - Similar to `Array.prototype.keys`
   *    except for this function produces a loop rather than iterator.
   * - Equivalent to `loop.map((_, i) => i)`.
   */
  keys(): Loop<number> {
    return new Loop(new KeysLoop(this.inner))
  }

  /**
   * Creates a loop that is limited to the specified number of items.
   *
   * - Equivalent to `this.slice(0, count)`.
   *
   * ## Edge cases
   *
   * The specified count may exceed the total count.
   *
   * - If `count` is negative, the specified range is empty and produced loop is empty.
   * - if `count` is larger than the number of items, it doesn't affect the underlying loop as result.
   */
  take(count: number): Loop<T> {
    return this.slice(0, count)
  }

  /**
   * Creates a loop that stops once it encounters an item
   * that doesn't satisfy the specified predicate.
   *
   * Equivalent to:
   *
   * ```ts
   *  for (const item of ...) {
   *      if (!predicate(item)) break
   *      action(item)
   *  }
   * ```
   */
  takeWhile(predicate: (item: T, index: number) => boolean): Loop<T> {
    return new Loop(new TakeWhileLoop<T>(this.inner, predicate))
  }

  /**
   * Creates a loop that skips all items while it encounters only items
   * that satisfy the specified predicate.
   *
   * Equivalent to:
   *
   * ```ts
   *  let skipping = true
   *  for (const item of ...) {
   *      if (skipping && predicate(item)) {
   *          skipping = false
   *          continue
   *      }
   *      action(item)
   *  }
   * ```
   */
  skipWhile(predicate: (item: T, index: number) => boolean): Loop<T> {
    return new Loop(new SkipWhileLoop<T>(this.inner, predicate))
  }

  /**
   * *Experimental*: This API might change in next version. (Especially behavior of negative indices.)
   *
   * Creates a loop that selects items only in the specified range.
   *
   * ## Behavior
   *
   * Similar to `Array.prototype.slice` but different.
   * This function doesn't allow negative indices.
   *
   * Equivalent to:
   *
   * ```ts
   *  let index = 0
   *  for (const item of ...) {
   *      if (index >= end) break
   *      if (index >= start) {
   *          action(item)
   *      }
   *      index++
   *  }
   * ```
   *
   * ## Edge cases
   *
   * The specified indices may exceed the boundary.
   *
   * - If `start` is negative, it doesn't skip starting items.
   * - If `start` is larger than the number of items, it skips all items.
   * - If `end` is negative, the specified range is empty and produced loop is empty.
   * - if `end` is larger than the number of items, it doesn't affect the underlying loop as result.
   */
  slice(start: number, end: number): Loop<T> {
    return new Loop(new SliceLoop<T>(this.inner, start, end))
  }

  /**
   * *Experimental*: This API might change in the next version.
   *
   * Runs the loop to get an item at the specified position.
   * Returns `undefined` if no item.
   *
   * - Same as `array[index]`.
   *    Equivalent to `loop.slice(index, index + 1).last()`.
   */
  at(index: number): T | undefined {
    return loopAt(this.inner, index)
  }

  /**
   * Runs the loop to get the last item.
   *
   * ## Behavior
   *
   * Equivalent to:
   *
   * ```ts
   *  let last = undefined
   *  for (const item of ...) {
   *      last = item
   *  }
   *  return last
   * ```
   */
  last(): T | undefined {
    return loopLast(this.inner)
  }

  /**
   * Runs the loop to count the number of items.
   *
   * ## Behavior
   *
   * Equivalent to:
   *
   * ```ts
   *  let count = 0
   *  for (const item of ...) {
   *      count++
   *  }
   *  return count
   * ```
   */
  count(): number {
    return loopCount(this.inner)
  }

  /**
   * Creates a loop that is concatenation of the loop (first) and the specified loop (second).
   *
   * - Similar to `Array.prototype.concat`.
   */
  concat(other: LoopSource<T>): Loop<T> {
    return new Loop(new ConcatLoop(this.inner, other))
  }

  /**
   * Creates a loop that the specified item is added at the start of the loop.
   *
   * ## Behavior
   *
   * Equivalent to `Loop.from([item]).concat(this)`.
   */
  prepend(item: T): Loop<T> {
    return new Loop(new PrependLoop(this.inner, item))
  }

  /**
   * Creates a loop that the specified item is added at the end of the loop.
   *
   * ## Behavior
   *
   * Equivalent to `this.concat([item])`.
   */
  append(item: T): Loop<T> {
    return new Loop(new AppendLoop(this.inner, item))
  }

  /**
   * Runs the loop to collect all items to an array.
   *
   * ## Behavior
   *
   * Equivalent to:
   *
   * ```ts
   *  let array = []
   *  this.forEach(item => {
   *      array.push(item)
   *  })
   *  return array
   * ```
   */
  toArray(): T[] {
    return loopToArray(this.inner)
  }

  /**
   * Runs the loop to concatenate all items
   * inserting the specified separator in each middle.
   *
   * - Similar to `Array.prototype.join`.
   */
  join(sep?: string): string {
    return loopJoin(this.inner, sep ?? "")
  }

  /**
   * Runs the loop to find an item that satisfy the specified predicate.
   * Returns `undefined` if no item does.
   *
   * - Similar to `Array.prototype.find`.
   */
  find<S extends T>(predicate: (value: T, index: number) => value is S): S | undefined
  find(predicate: (value: T, index: number) => unknown): T | undefined
  find(predicate: (value: T, index: number) => unknown): unknown {
    return loopFind(this.inner, predicate)
  }

  /**
   * Runs the loop to get the first non-`undefined` result
   * populated by the specified function.
   *
   * - Equivalent to `this.choose(picker).at(0)`.
   */
  pick<U>(picker: (value: T, index: number) => U | undefined): U | undefined {
    return loopPick(this.inner, picker)
  }

  /**
   * Runs the loop to get whether the specified value is included in the loop.
   *
   * - Similar to `Array.prototype.includes`.
   *    Equivalent to `this.some(item => item === searchElement)`.
   */
  includes(searchElement: T): boolean {
    return loopIncludes(this.inner, searchElement)
  }

  /**
   * Creates a loop that rearranges items in order.
   *
   * ## Behavior
   *
   * Similar to but different than `Array.prototype.sort`.
   * This function doesn't affect the loop itself.
   *
   * *Buffering*: The underlying loop doesn't stop. An intermediate array is created.
   *
   * Equivalent to:
   *
   * ```ts
   *  Loop.generate(action => {
   *      const array = this.toArray()
   *      array.sort(compare)
   *      array.forEach(action)
   *  })
   * ```
   */
  sort(compare?: (x: T, y: T) => number): Loop<T> {
    return new Loop(new SortLoop(this.inner, compare))
  }
}

const EMPTY: Loop<never> = new Loop(EMPTY_LOOP)
