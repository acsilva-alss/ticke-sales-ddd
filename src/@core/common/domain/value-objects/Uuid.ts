import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { ValueObject } from './ValueObject';

export class Uuid extends ValueObject<string> {
  constructor(id?: string) {
    super(id || uuidv4());
    this.validate();
  }

  private validate() {
    try {
      const isValid = uuidValidate(this.value);
      if (!isValid) throw new InvalidUuidError(this.value);
    } catch (e) {
      console.log(e);
    }
  }
}

export class InvalidUuidError extends Error {
  constructor(invalidValue: any) {
    super(`Value ${invalidValue} must be a valid UUID`);
    this.name = 'InvalidUuidError';
  }
}

export default Uuid;
