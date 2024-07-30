/* eslint-disable @typescript-eslint/no-unused-vars */
import { Type, Platform, EntityProperty } from '@mikro-orm/core';
import { Name } from 'src/@core/common';

export class NameSchemaType extends Type<Name, string> {
  convertToDatabaseValue(
    valueObject: Name | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof Name
      ? valueObject.value
      : (valueObject as string);
  }

  //não funciona para relacionamentos
  convertToJSValue(value: string, platform: Platform): Name {
    return new Name(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `VARCHAR(11)`;
  }
}
