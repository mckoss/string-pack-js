import { assert } from 'chai';

import { toName } from '../name-generator';

suite("name-generator", () => {
  test("expected-names", () => {
    const expected: {[index: number]: string} = {
      0: 'a', 1: 'b', 2: 'c',
      26: 'A', 27: 'B',
      52: '_', 53: '$',
      54: 'aa', 55: 'ab',
      108: 'a0', 109: 'a1',
      117: 'a9', 118: 'ba',
      [54 + 64]: 'ba',
      [54 + 2 * 64]: 'ca',
      [54 + 54 * 64 - 1]: '$9',
      [54 + 54 * 64]: 'aaa',
      [54 + 54 * 64 + 1]: 'aab',
    };

    Object.keys(expected).forEach((key) => {
      const index: number = +key;
      assert.equal(toName(index), expected[index]);
    });
  });
});
