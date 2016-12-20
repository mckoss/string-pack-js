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

const initial =
  "abcdefghijklmnopqrstuvwxyz" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ_$";

const subsequent = initial + "0123456789";

// Generate small, unique javascript-allowed symbol names.
export function toName(n: number): string {
  let places: number;
  let range: number;
  for (places = 1, range = initial.length;
       n >= range;
       n -= range, places++, range *= subsequent.length) {
    /*_*/
  }
  let result = "";
  while (places--) {
    const chars = places === 0 ? initial : subsequent;
    let i = n % chars.length;
    result = chars[i] + result;
    n = (n - i) / chars.length;
  }
  return result;
}
