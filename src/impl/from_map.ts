import type { Flow, LoopInterface } from "../loop_types"

export class FromMapLoop<K, T> implements LoopInterface<readonly [K, T]> {
  constructor(private readonly map: Map<K, T>) { }

  iterate(action: (item: readonly [K, T]) => void, flow: Flow): void {
    const pair = [] as unknown as [K | undefined, T | undefined]
    this.map.forEach((value, key) => {
      if (!flow.running) return
      pair[0] = key
      pair[1] = value
      action(pair as [K, T])
    })
  }
}

export class FromSetLoop<T> implements LoopInterface<T> {
  constructor(private readonly set: Set<T>) { }

  iterate(action: (item: T) => void, flow: Flow): void {
    this.set.forEach(item => {
      if (!flow.running) return
      action(item)
    })
  }
}
