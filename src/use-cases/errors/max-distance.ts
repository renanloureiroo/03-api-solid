class MaxDistance extends Error {
  constructor() {
    super(
      'Max distance allowed to check in is 100 meters. Please, get closer to the gym.',
    )
  }
}

export { MaxDistance }
