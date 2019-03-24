import { shallowCompare } from '../src/shallow-compare';

describe('util: shallow compare', () => {

  describe('should match by', () => {
    test('reference', () => {
      const a = { a: 1, b: 2 };
      const b = a;

      expect(shallowCompare(a, b)).toEqual(true);
    });

    test('shape', () => {
      const a = { a: 1, b: 2 };
      const b = { a: 1, b: 2 };

      expect(shallowCompare(a, b)).toEqual(true);
    });

    test('spread', () => {
      const a = { a: { c: 3 }, b: 2 };
      const b = { ...a };

      expect(shallowCompare(a, b)).toEqual(true);
    });
  });

  describe('should not match by', () => {
    test('different shape: should not match objects', () => {
      const a = { a: 1, b: 2 };
      const b = { a: 1 };

      expect(shallowCompare(a, b)).toEqual(false);
    });
  });


});
