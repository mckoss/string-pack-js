import { assert } from 'chai';

import * as fs from 'fs';

import { pack } from '../pack';
import { zipSize } from '../util';

const TEST_DATA_DIR = process.env.PROJ_DIR + '/src/test/data';

suite("pack", () => {
  test("no-strings", () => {
    const result = pack('x=1;');
    assert.equal(result, 'x=1;');
  });

  test("one-string", () => {
    const result = pack("x=\'hello\';");
    assert.equal(result, "x=_.a;");
  });

  test("two-strings", () => {
    const result = pack("x=\'hello\';y='goodbye';");
    assert.equal(result, "x=_.a;y=_.b;");
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
