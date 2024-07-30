import { AggregateRoot, Uuid } from 'src/@core/common';
import { CustomerId } from './Customer';
import { SpotId } from './Spot';

export class OrderId extends Uuid {}

export type OrderConstructorProps = {
  id?: string | OrderId;
  customerId: string | CustomerId;
  amount: number;
  spotId: string | SpotId;
};

export type OrderCreateProps = {
  customerId: string | CustomerId;
  amount: number;
  spotId: string | SpotId;
};

export enum OrderStatus {
  PENDING,
  PAID,
  CANCELLED,
}

export class Order extends AggregateRoot {
  id: OrderId;
  customerId: CustomerId;
  amount: number;
  spotId: SpotId;
  status: OrderStatus = OrderStatus.PENDING;

  constructor(props: OrderConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new OrderId(props.id)
        : props.id ?? new OrderId();
    this.customerId =
      typeof props.customerId === 'string'
        ? new CustomerId(props.customerId)
        : props.customerId ?? new CustomerId();
    this.spotId =
      typeof props.spotId === 'string'
        ? new SpotId(props.spotId)
        : props.spotId ?? new SpotId();
    this.amount = props.amount;
  }

  static create(props: OrderConstructorProps) {
    return new Order(props);
  }

  public pay() {
    this.status = OrderStatus.PAID;
  }

  public cancel() {
    this.status = OrderStatus.CANCELLED;
  }

  public toJSON() {
    return {
      id: this.id.value,
      customerId: this.customerId.value,
      amount: this.amount,
      spotId: this.spotId.value,
    };
  }
}
