export class UnauthorizedError extends Error {
  public statusCode: number;

  constructor() {
    super("Unauthorized.");
    this.statusCode = 401;
  }
}
