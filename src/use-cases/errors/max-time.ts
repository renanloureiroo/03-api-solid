class MaxTime extends Error {
  constructor() {
    super('Max time allowed to validate a check in is 20 minutes.')
  }
}

export { MaxTime }
