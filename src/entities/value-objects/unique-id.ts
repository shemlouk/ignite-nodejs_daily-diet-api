import { randomUUID } from "node:crypto";

export class UniqueID {
  readonly value: string;

  constructor(id?: string) {
    this.value = id ?? randomUUID();
  }
}
