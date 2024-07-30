/* eslint-disable @typescript-eslint/no-unused-vars */
import { Type, Platform, EntityProperty } from '@mikro-orm/core';
import { CPF } from 'src/@core/common';

export class CpfSchemaType extends Type<CPF, string> {
  convertToDatabaseValue(
    valueObject: CPF | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof CPF
      ? valueObject.value
      : (valueObject as string);
  }

  //não funciona para relacionamentos
  convertToJSValue(value: string, platform: Platform): CPF {
    return new CPF(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `VARCHAR(11)`;
  }
}
