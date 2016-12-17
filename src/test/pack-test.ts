import { assert } from 'chai';

import { pack } from '../pack';

const NO_STRINGS = "x=1;";
const ONE_STRING = "x=\'hello\';";

suite("pack", () => {
  test("no-strings", () => {
    const result = pack(NO_STRINGS);
    assert.equal(result, NO_STRINGS);
  });

  test("one-string", () => {
    const result = pack(ONE_STRING);
    assert.equal(result, "x=_.a;");
  });
});
