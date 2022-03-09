/** Represents an iteration. */
export interface LoopInterface<T> {
  /**
   * Runs a loop. That is, this function calls the specified action repeatedly.
   *
   * - Mutate `flow.running = false` to `break` from current iteration.
   */
  iterate(action: (item: T) => void, flow: Flow): void
}

/** Value that a loop can be made from. */
export type LoopSource<T> = readonly T[] | LoopInterface<T>

export interface Flow {
  /** Indicates current iteration is still running (not break). */
  running: boolean
}
