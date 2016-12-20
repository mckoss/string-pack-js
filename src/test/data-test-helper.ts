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

export interface ObjectSpec {
  label?: string;
  data: any;
  expect?: any;
};

export type ArraySpec = [any, any];

export type ValueSpec = any;

export type Spec = ObjectSpec | ArraySpec | ValueSpec;

export type TestFunction = (data: any, expect: any, spec: Spec) => void;

export type FormatFunction = (data: any) => string;

/*
 * Run data driven tests with specs in one of the Spec formats.
 *
 * Calls testIt(data, expect) for each test.
 */
export function dataDrivenTest(tests: Spec[],
                               testIt: TestFunction,
                               formatter = format) {
  let data: any;
  let expect: any;
  let label: string;

  for (let i = 0; i < tests.length; i++) {
    // Not Array or Object
    if (typeof tests[i] !== 'object') {
      data = tests[i];
      expect = undefined;
    } else {
      data = tests[i].data || tests[i][0] || tests[i];
      expect = tests[i].expect || tests[i][1];
    }

    label = tests[i].label;
    if (label === undefined) {
      if (expect !== undefined) {
        label = formatter(data) + " => " + formatter(expect);
      } else {
        label = formatter(data);
      }
    }

    test(label, testIt.bind(undefined, data, expect, tests[i]));
  }
}

function format(value: any): string {
  if (value instanceof RegExp) {
    return value.toString();
  }
  return JSON.stringify(value);
}
