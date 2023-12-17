import bcrypt from "bcrypt";

export class Hash {
  static #saltRounds = 6;
  #hash: string;

  constructor(value: string) {
    try {
      const hashRounds = bcrypt.getRounds(value);
      if (hashRounds !== Hash.#saltRounds) throw new Error("Invalid hash.");

      this.#hash = value;
    } catch (error) {
      this.#hash = bcrypt.hashSync(value, Hash.#saltRounds);
    }
  }

  compare(value: string) {
    return bcrypt.compareSync(value, this.#hash);
  }

  get value() {
    return this.#hash;
  }
}
