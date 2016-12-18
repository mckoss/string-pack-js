import { assert } from 'chai';

import * as index from '../index';

suite("index", () => {
  test("export-symbols", () => {
    assert.isDefined(index.main);
    assert.isDefined(index.packFile);
  });

  test("missing-args", () => {
    assert.throws(() => {
      index.main([]);
    }, /Usage/);
  });
});
