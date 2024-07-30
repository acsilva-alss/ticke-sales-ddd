/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityProperty, Platform, Type } from '@mikro-orm/core';
import { CustomerId } from 'src/@core/events/domain';

export class CustomerIdSchemaType extends Type<CustomerId, string> {
  convertToDatabaseValue(
    valueObject: CustomerId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof CustomerId
      ? valueObject.value
      : (valueObject as string);
  }

  //não funciona para relacionamentos
  convertToJSValue(value: string, platform: Platform): CustomerId {
    return new CustomerId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `varchar(36)`;
  }
}
