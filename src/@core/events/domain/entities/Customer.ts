import { AggregateRoot, Name, CPF, Uuid } from 'src/@core/common';

type CustomerConstructorProps = {
  id?: CustomerId | string;
  cpf: CPF;
  name: Name;
};

type CustomerCreateProps = {
  cpf: string;
  name: string;
};

export class CustomerId extends Uuid {}

export class Customer extends AggregateRoot {
  id: CustomerId;
  cpf: CPF;
  name: Name;

  constructor(props: CustomerConstructorProps) {
    super();
    const { id, name, cpf } = props;
    this.id =
      typeof id === 'string' ? new CustomerId(id) : id ?? new CustomerId();
    this.cpf = cpf;
    this.name = name;
  }

  static create(props: CustomerCreateProps) {
    const { cpf, name } = props;
    return new Customer({ cpf: new CPF(cpf), name: new Name(name) });
  }

  toJSON() {
    return {
      id: this.id,
      cpf: this.cpf,
      name: this.name,
    };
  }
}
