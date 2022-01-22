import type { LoopInterface } from "../loop"

export function loopReduce<S, T>(source: LoopInterface<T>, reducer: (prev: S, item: T, index: number) => S, initialValue: S): S
export function loopReduce<T>(source: LoopInterface<T>, reducer: (prev: T, item: T, index: number) => T): T
export function loopReduce(source: LoopInterface<any>, reducer: any, state?: any): any {
  let index = 0
  if (arguments.length === 3) {
    source.iterate(item => {
      state = reducer(state, item, index++)
    })
    return state
  } else {
    let state: any
    source.iterate(item => {
      if (index === 0) { state = item; index = 1; return }
      state = reducer(state, item, index++)
    })
    return state
  }
}
