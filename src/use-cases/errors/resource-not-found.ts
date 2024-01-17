class ResourceNotFound extends Error {
  constructor() {
    super('Resource not found.')
  }
}

export { ResourceNotFound }
