export class ConflictError extends Error {
  public statusCode: number;

  constructor(resource: string) {
    super(`${resource} already in use.`);
    this.statusCode = 409;
  }
}
