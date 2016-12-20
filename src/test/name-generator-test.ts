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
