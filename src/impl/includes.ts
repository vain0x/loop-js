import type { LoopInterface } from "../loop_types"
import { loopEvery } from "./every"

export const loopIncludes = <T>(loop: LoopInterface<T>, searchElement: T): boolean =>
  !loopEvery(loop, item => item !== searchElement)
