import type { LoopInterface, LoopSource } from "../loop_types"
import { FromArrayLoop } from "./from_array"

export const loopFrom = <T>(source: LoopSource<T>): LoopInterface<T> =>
  Array.isArray(source) ? new FromArrayLoop(source) : source as LoopInterface<T>
