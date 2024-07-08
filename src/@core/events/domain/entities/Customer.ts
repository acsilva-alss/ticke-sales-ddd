import { AggregateRoot, Name, CPF, Uuid } from '../../../common/domain';

type CustomerConstructorProps = {
  id?: string;
  cpf: string;
  name: string;
};

type CustomerCreateProps = {
  cpf: string;
  name: string;
};

type CustomerRestoreProps = {
  id: string;
  cpf: string;
  name: string;
};

export class CustomerId extends Uuid {}

export class Customer extends AggregateRoot {
  readonly id?: CustomerId;
  cpf: CPF;
  name: Name;

  constructor(props: CustomerConstructorProps) {
    super();
    const { id, name, cpf } = props;
    this.id = new CustomerId(id);
    this.cpf = new CPF(cpf);
    this.name = new Name(name);
  }

  static create(props: CustomerCreateProps) {
    const { cpf, name } = props;
    return new Customer({ cpf, name });
  }

  static restore(props: CustomerRestoreProps) {
    const { id, cpf, name } = props;
    return new Customer({ id, cpf, name });
  }

  toJSON() {
    return {
      id: this.id,
      cpf: this.cpf,
      name: this.name,
    };
  }
}
