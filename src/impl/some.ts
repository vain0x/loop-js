import type { LoopInterface } from "../loop"
import { loopEvery } from "./every"

export const loopSome = <T>(source: LoopInterface<T>, predicate: (item: T, index: number) => boolean): boolean =>
  !loopEvery(source, (item, index) => !predicate(item, index))
