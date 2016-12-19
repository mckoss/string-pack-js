import { assert } from 'chai';

import { dataDrivenTest } from './data-test-helper';

import * as fs from 'fs';

import { pack, stringStats } from '../pack';
import { zipSize } from '../util';

const TEST_DATA_DIR = process.env.PROJ_DIR + '/src/test/data';

suite("pack", () => {
  let tests = [
    [ 'x=1;', 'x=1;' ],
    [ "x=\'hello\';", "x=\'hello\';" ],
    [ "x=\'hello\';y='hello';", "_={a:\"hello\"};x=_.a;y=_.a;" ],
  ];

  dataDrivenTest(tests, (data, expect) => {
    const result = pack(data);
    assert.equal(result, expect);
  });

  test("firebase.js", () => {
    const binary = fs.readFileSync(TEST_DATA_DIR + '/firebase.js', 'utf8');
    const packed = pack(binary);
    assert.isBelow(packed.length, binary.length);
    assert.isBelow(zipSize(packed), zipSize(binary));
  });
});

suite("string-stats", () => {
  let tests = [
    [ 'x=1;', {count: 0, average: undefined} ],
    [ 'a="a";b="b";', {count: 2, average: 1} ],
  ];

  dataDrivenTest(tests, (data, expect) => {
    let stats = stringStats(data)['lengths'];
    assert.equal(stats.count, expect.count);
    assert.equal(stats.average, expect.average);
  });
});
