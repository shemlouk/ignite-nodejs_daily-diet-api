import { UniqueID } from "./value-objects/unique-id";

export abstract class Entity {
  private _id: UniqueID;

  constructor(id?: string) {
    this._id = new UniqueID(id);
  }

  get id() {
    return this._id.value;
  }
}
