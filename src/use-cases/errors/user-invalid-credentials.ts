class InvalidCredentials extends Error {
  constructor() {
    super('Email or password incorrect.')
  }
}

export { InvalidCredentials }
