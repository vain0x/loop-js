import type { LoopInterface } from "../loop"
import { FromArrayLoop } from "./from_array"

export type LoopSource<T> = readonly T[] | LoopInterface<T>

export const loopFrom = <T>(source: LoopSource<T>): LoopInterface<T> =>
  Array.isArray(source) ? new FromArrayLoop(source) : source as LoopInterface<T>
