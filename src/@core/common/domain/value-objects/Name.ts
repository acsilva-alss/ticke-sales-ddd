import { ValueObject } from './ValueObject';

export class Name extends ValueObject<string> {
  constructor(name: string) {
    super(name);
    this.validate();
  }

  private validate() {
    if (this.value.length < 3 || this.value.length > 80) {
      throw new Error('The name is not in the format');
    }
    return true;
  }
}
