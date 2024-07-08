import { Entity, Uuid } from 'src/@core/common';

export class SpotId extends Uuid {}

export type SpotConstructorProps = {
  id?: SpotId | string;
  location: string | null;
  isReserved: boolean;
  isPublished: boolean;
};

export class Spot extends Entity {
  id: SpotId;
  location: string | null;
  isReserved: boolean;
  isPublished: boolean;

  constructor(props: SpotConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new SpotId(props.id)
        : props.id ?? new SpotId();
    this.location = props.location;
    this.isReserved = props.isReserved;
    this.isPublished = props.isPublished;
  }

  static create() {
    return new Spot({
      location: null,
      isPublished: false,
      isReserved: false,
    });
  }

  public changeLocation(location: string) {
    this.location = location;
  }

  public publish() {
    this.isPublished = true;
  }

  public unPublish() {
    this.isReserved = false;
  }

  public markAsReserved() {
    this.isReserved = true;
  }

  toJSON() {
    return {
      id: this.id.value,
      location: this.location,
      reserved: this.isReserved,
      ispublished: this.isPublished,
    };
  }
}
