import { CPF } from '../CPF';

describe('Tests on CPF value object', () => {
  const wrongSizeCpf = ['026 950 410 985', '0', '026950410985856'];

  const wrongSameDigitCpf = [
    '111.111.111-11',
    '222.222.222-22',
    '333.333.333-33',
  ];

  it('should be return true if cpf is valid', () => {
    const cpf = new CPF('02695041098');
    expect(cpf.value).toBe('02695041098');
  });

  it('should be return true if cpf is valid with dot and dash', () => {
    const cpf = new CPF('026.950.410-98');
    expect(cpf.value).toBe('026.950.410-98');
  });

  it.each(wrongSizeCpf)(
    'should be return false if length of cpf is wrong',
    (invalidCpf) => {
      expect(() => new CPF(invalidCpf)).toThrow(
        new Error('ERROR! Invalid CPF'),
      );
    },
  );

  it('should be return error if cpf is blank', () => {
    expect(() => new CPF(' ')).toThrow(new Error('ERROR! Invalid CPF'));
  });

  it.each(wrongSameDigitCpf)(
    'should be return error if all the digits are the same',
    (cpf) => {
      expect(() => new CPF(cpf)).toThrow(new Error('ERROR! Invalid CPF'));
    },
  );

  it('should be return error if pass a letter', () => {
    expect(() => new CPF('abcdfgabcha')).toThrow(
      new Error('ERROR! Invalid CPF'),
    );
  });
});
