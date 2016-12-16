import { assert } from 'chai';

import { pack } from '../pack';

const NO_STRINGS = "x=1;";

suite("pack", () => {
  test("no-strings", () => {
    const result = pack(NO_STRINGS);
    assert.equal(result, NO_STRINGS);
  });
});
