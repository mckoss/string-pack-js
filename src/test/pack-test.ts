// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
    [ "x=\'hello\';y='hello';", "_={a:\"hello\"};\nx=_.a;y=_.a;" ],
  ];

  dataDrivenTest(tests, (data, expect) => {
    const result = pack(data);
    assert.equal(result, expect);
  });

  test("firebase.js", () => {
    const binary = fs.readFileSync(TEST_DATA_DIR + '/firebase.js', 'utf8');
    const packed = pack(binary);
    console.log(`Raw size: ${binary.length} => ${packed.length}`);
    console.log(`Zipped size: ${zipSize(binary)} => ${zipSize(packed)}`);

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
