export class ConflictError extends Error {
  constructor(resource: string) {
    super(`${resource} already in use.`);
  }
}
