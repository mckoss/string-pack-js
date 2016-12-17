import { assert } from 'chai';

import { dataDrivenTest } from './data-test-helper';

import * as fs from 'fs';

import { pack } from '../pack';
import { zipSize } from '../util';

const TEST_DATA_DIR = process.env.PROJ_DIR + '/src/test/data';

suite("pack", () => {
  let tests = [
    [ 'x=1;', 'x=1;' ],
    [ "x=\'hello\';", "x=_.a;" ],
    [ "x=\'hello\';y='goodbye';", "x=_.a;y=_.b;" ],
  ];

  dataDrivenTest(tests, (data, expect) => {
    const result = pack(data);
    assert.equal(result, expect);
  });

  test("firebase.js", () => {
    const binary = fs.readFileSync(TEST_DATA_DIR + '/firebase.js', 'utf8');
    const packed = pack(binary);
    const data = [binary, packed];
    const info = data.map((c) => {
      let result: string[] = [];
      result.push("Unpacked size: " + c.length);
      result.push("Packed size: " + zipSize(c));
      result.push("Sample: ");
      const codeStart = c.indexOf('var firebase');
      result.push(c.slice(codeStart, codeStart + 300));
      return result.join('\n');
    });
    console.log(info.join('\n========\n'));
    assert.isBelow(packed.length, binary.length);
    assert.isBelow(zipSize(packed), zipSize(binary));
  });
});
