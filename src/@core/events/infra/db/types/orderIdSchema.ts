/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityProperty, Platform, Type } from '@mikro-orm/core';
import { OrderId } from 'src/@core/events/domain';

export class OrderIdSchemaType extends Type<OrderId, string> {
  convertToDatabaseValue(
    valueObject: OrderId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof OrderId
      ? valueObject.value
      : (valueObject as string);
  }

  //não funciona para relacionamentos
  convertToJSValue(value: string, platform: Platform): OrderId {
    return new OrderId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `varchar(36)`;
  }
}
