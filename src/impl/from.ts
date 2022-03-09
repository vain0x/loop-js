import type { LoopInterface, LoopSource } from "../loop_types"
import { EMPTY_LOOP } from "./empty"
import { FromArrayLoop } from "./from_array"

export const loopFrom = <T>(source: LoopSource<T>): LoopInterface<T> =>
  Array.isArray(source) ? new FromArrayLoop(source) : (source == null ? EMPTY_LOOP : source as LoopInterface<T>)
