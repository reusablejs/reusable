import { shallowEqual } from '../src/shallow-equal';

describe('util: shallow compare', () => {

  describe('should match by', () => {
    test('value', () => {
      const a = 'hello';
      const b = 'hello';

      expect(shallowEqual(a, b)).toEqual(true);
    });

    test('reference', () => {
      const a = { a: 1, b: 2 };
      const b = a;

      expect(shallowEqual(a, b)).toEqual(true);
    });

    test('shape', () => {
      const a = { a: 1, b: 2 };
      const b = { a: 1, b: 2 };

      expect(shallowEqual(a, b)).toEqual(true);
    });

    test('spread', () => {
      const a = { a: { c: 3 }, b: 2 };
      const b = { ...a };

      expect(shallowEqual(a, b)).toEqual(true);
    });
  });

  describe('should not match by', () => {
    test('different value', () => {
      const a = 'hello';
      const b = 'hello2';

      expect(shallowEqual(a, b)).toEqual(false);
    });

    test('different shape: should not match objects', () => {
      const a = { a: 1, b: 2 };
      const b = { a: 1 };

      expect(shallowEqual(a, b)).toEqual(false);
    });
  });


});
