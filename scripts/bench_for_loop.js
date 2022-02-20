const N = 3e7

const f = (label, mapping, flow) => {
  let bi // index of break

  console.time(label)
  let n = 0 // XOR accumulator
  for (let i = 0; i < N; i++) {
    n ^= mapping(i, flow)
    if (!flow.running) { bi = i; break }
  }
  console.timeEnd(label)

  if (bi != undefined) {
    n ^= bi
    console.log("  break i=", bi)
  }

  // Use n so that optimizer can't eliminate the loop.
  if (n !== 0) throw new Error("unreachable")
}

const id = x => x

// Do twice to see how JIT affects.
for (let r = 1; r <= 2; r++) {
  console.log("round", r)

  f("baseline", id, { running: true })

  // `flow` is frozen.
  // Someone reports frozen object is much slower. Not observed with this script.
  f("frozen", id, Object.freeze({ running: true }))

  // `flow.running` is defined as a non-configurable, non-writable property
  // as alternative way of `freeze`.
  {
    const flow = {}
    Object.defineProperty(flow, "running", { value: true, configurable: false, writable: false })
    f("defined", id, flow)
  }

  // `flow.running` is defined as a getter. Very slow.
  f("getter", id, { get running() { return true } })

  // `flow.running` becomes false at a point.
  {
    const action = (i, flow) => {
      if (i === 1e7) flow.running = false
      return i
    }
    f("early-break", action, { running: true })
  }

  // `flow.running` might become false, at least optimizer thinks so, but actually not.
  {
    const flow = { running: true }
    const action = (i, flow) => {
      if (i === 1e9) flow.running = false
      return i
    }
    f("potentially-break", action, flow)
  }
}
