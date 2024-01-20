class PageExtrapolatedTotalPages extends Error {
  constructor() {
    super('The page requested is greater than the total number of pages.')
  }
}

export { PageExtrapolatedTotalPages }
