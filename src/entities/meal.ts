import { Entity } from "./entity";
import { UniqueID } from "./value-objects/unique-id";

interface MealProps {
  userId: UniqueID;
  name: string;
  description: string;
  timestamp: Date;
  isOnDiet: boolean;
}

export class Meal extends Entity {
  private _data: MealProps;

  constructor(data: MealProps, id?: string) {
    super(id);
    this._data = data;
  }

  toObject() {
    return Object.freeze({
      id: this.id,
      name: this.name,
      description: this.description,
      timestamp: this.timestamp,
      isOnDiet: this.isOnDiet,
    });
  }

  get userId() {
    return this._data.userId.value;
  }

  get name() {
    return this._data.name;
  }

  get description() {
    return this._data.description;
  }

  get timestamp() {
    return this._data.timestamp;
  }

  get isOnDiet() {
    return this._data.isOnDiet;
  }

  set name(value: string) {
    this._data.name = value;
  }

  set description(value: string) {
    this._data.description = value;
  }

  set timestamp(value: Date) {
    this._data.timestamp = value;
  }

  set isOnDiet(value: boolean) {
    this._data.isOnDiet = value;
  }
}
