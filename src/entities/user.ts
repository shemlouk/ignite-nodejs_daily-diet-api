import { Entity } from "./entity";
import { Hash } from "./value-objects/hash";

interface UserProps {
  name: string;
  email: string;
  password: string;
}

export class User extends Entity {
  #hashedPassword: Hash;

  private _name: string;
  private _email: string;

  constructor({ name, email, password }: UserProps, id?: string) {
    super(id);
    this._name = name;
    this._email = email;
    this.#hashedPassword = new Hash(password);
  }

  comparePassword(password: string) {
    return this.#hashedPassword.compare(password);
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  set name(value: string) {
    this._name = value;
  }

  set email(value: string) {
    this._email = value;
  }
}
