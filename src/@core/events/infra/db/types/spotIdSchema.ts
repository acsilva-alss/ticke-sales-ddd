/* eslint-disable @typescript-eslint/no-unused-vars */
import { Type, Platform, EntityProperty } from '@mikro-orm/core';
import { SpotId } from 'src/@core/events/domain';

export class SpotIdSchemaType extends Type<SpotId, string> {
  convertToDatabaseValue(
    valueObject: SpotId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof SpotId
      ? valueObject.value
      : (valueObject as string);
  }

  //não funciona para relacionamentos
  convertToJSValue(value: string, platform: Platform): SpotId {
    return new SpotId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `varchar(36)`;
  }
}
