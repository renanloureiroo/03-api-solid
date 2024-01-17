class UserAlreadyExists extends Error {
  constructor() {
    super('E-mail already exists.')
  }
}

export { UserAlreadyExists }
