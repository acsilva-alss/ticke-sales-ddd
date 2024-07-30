import { AggregateRoot, Name, Uuid } from 'src/@core/common';
import { Event } from './Event';

export class PartnerId extends Uuid {}

export type InitEventCommand = {
  name: string;
  description?: string | null;
  date: Date;
};

export type PartnerConstructorProps = {
  id?: PartnerId | string;
  name: Name;
};

export class Partner extends AggregateRoot {
  id: PartnerId;
  name: Name;

  constructor(props: PartnerConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new PartnerId(props.id)
        : props.id ?? new PartnerId();
    this.name = props.name;
  }

  static create(command: { name: string }) {
    return new Partner({
      name: new Name(command.name),
    });
  }

  public initEvent(command: InitEventCommand) {
    return Event.create({
      ...command,
      partnerId: this.id,
    });
  }

  public changeName(name: string) {
    this.name = new Name(name);
  }

  public toJSON() {
    return {
      id: this.id.value,
      name: this.name,
    };
  }
}
