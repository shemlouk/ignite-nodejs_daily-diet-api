export class InvalidFormatError extends Error {
  public statusCode: number;

  constructor(errors: object) {
    super(JSON.stringify(errors));
    this.statusCode = 422;
  }
}
