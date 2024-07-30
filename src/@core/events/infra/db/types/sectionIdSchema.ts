/* eslint-disable @typescript-eslint/no-unused-vars */
import { Type, Platform, EntityProperty } from '@mikro-orm/core';
import { SectionId } from 'src/@core/events/domain';

export class SectionIdSchemaType extends Type<SectionId, string> {
  convertToDatabaseValue(
    valueObject: SectionId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof SectionId
      ? valueObject.value
      : (valueObject as string);
  }

  //não funciona para relacionamentos
  convertToJSValue(value: string, platform: Platform): SectionId {
    return new SectionId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `varchar(36)`;
  }
}
