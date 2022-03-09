import type { LoopInterface } from "../loop_types"

export const EMPTY_LOOP: LoopInterface<never> = {
  iterate: () => { },
}
