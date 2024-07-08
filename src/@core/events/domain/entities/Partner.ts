import { AggregateRoot, Uuid } from 'src/@core/common';
import { Event } from './Event';

export class PartnerId extends Uuid {}

export type InitEventCommand = {
  name: string;
  description?: string | null;
  date: Date;
};

export type PartnerConstructorProps = {
  id?: PartnerId | string;
  name: string;
};

export class Partner extends AggregateRoot {
  id: PartnerId;
  name: string;

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
      name: command.name,
    });
  }

  public initEvent(command: InitEventCommand) {
    return Event.create({
      ...command,
      partnerId: this.id,
    });
  }

  public changeName(name: string) {
    this.name = name;
  }

  public toJSON() {
    return {
      id: this.id.value,
      name: this.name,
    };
  }
}
