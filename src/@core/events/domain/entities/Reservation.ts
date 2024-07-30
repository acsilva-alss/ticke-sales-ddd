import { AggregateRoot } from 'src/@core/common';
import { SpotId } from './Spot';
import { CustomerId } from './Customer';

export type ReservationProps = {
  spotId: string | SpotId;
  date: Date;
  customerId: string | CustomerId;
};

export type ReservationCommand = {
  spotId: string;
  customerId: string;
};

export class Reservation extends AggregateRoot {
  spotId: SpotId;
  date: Date;
  customerId: CustomerId;

  constructor(props: ReservationProps) {
    super();
    typeof props.spotId === 'string'
      ? new SpotId(props.spotId)
      : props.spotId ?? new SpotId();
    typeof props.customerId === 'string'
      ? new CustomerId(props.customerId)
      : props.customerId ?? new CustomerId();
    this.date = props.date;
  }

  static create(props: ReservationCommand) {
    return new Reservation({
      spotId: props.spotId,
      customerId: props.customerId,
      date: new Date(),
    });
  }

  public changeReservation(customerId: CustomerId) {
    this.customerId = customerId;
    this.date = new Date();
  }

  toJSON() {
    throw new Error('Method not implemented.');
  }
}
