import { Entity } from "./entity";
import { Hash } from "./value-objects/hash";

interface UserProps {
  name: string;
  email: string;
  password: string;
}

export class User extends Entity {
  private _data: {
    name: string;
    email: string;
    hashedPassword: Hash;
  };

  constructor({ name, email, password }: UserProps, id?: string) {
    super(id);

    this._data = {
      name,
      email,
      hashedPassword: new Hash(password),
    };
  }

  comparePassword(password: string) {
    return this._data.hashedPassword.compare(password);
  }

  get name() {
    return this._data.name;
  }

  get email() {
    return this._data.email;
  }

  set name(value: string) {
    this._data.name = value;
  }

  set email(value: string) {
    this._data.email = value;
  }
}
