export class APIError extends Error {
  constructor(message: string, options?: {}) {
    super(message, options)
  }
}
