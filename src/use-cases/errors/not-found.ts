export class NotFoundError extends Error {
  public statusCode: number;

  constructor(resource: string) {
    super(`${resource} not found.`);
    this.statusCode = 404;
  }
}
