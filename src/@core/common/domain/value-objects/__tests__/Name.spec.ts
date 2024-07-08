import { Name } from '../Name';

it('should create a valid name', () => {
  const name = new Name('aaaa');
  expect(name.value).toBe('aaaa');
});

it('should not create a name less than 3 characters', () => {
  expect(() => new Name('aa')).toThrow(
    new Error('The name is not in the format'),
  );
});
