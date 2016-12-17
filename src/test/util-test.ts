import { assert } from 'chai';

import { zipSize } from '../util';

suite("util", () => {
  test("zipSize", () => {
    assert.equal(zipSize(''), 8);
    assert.equal(zipSize('a'), 9);
    assert.equal(zipSize('aaaaaaaaaa'), 11);
    assert.equal(zipSize('Hello, world\n'.repeat(10000)), 293);
  });
});
