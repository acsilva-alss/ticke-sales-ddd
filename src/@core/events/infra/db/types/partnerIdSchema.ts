/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityProperty, Platform, Type } from '@mikro-orm/core';
import { PartnerId } from 'src/@core/events/domain/entities/Partner';

export class PartnerIdSchemaType extends Type<PartnerId, string> {
  convertToDatabaseValue(
    valueObject: PartnerId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof PartnerId
      ? valueObject.value
      : (valueObject as string);
  }

  convertToJSValue(value: string, platform: Platform): PartnerId {
    return new PartnerId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform): string {
    return 'varchar(36)';
  }
}
