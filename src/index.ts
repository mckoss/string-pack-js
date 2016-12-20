#!/usr/bin/env node

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

import * as fs from 'fs';

import { pack, stringStats } from './pack';

// Command-line argument processing.
export function main(args: string[]) {
  if (args.length !== 1) {
    throw new Error("Usage: string-pack-js <file.js>");
  }
  packFile(args[0]);
}

// Pack a single file and write to '<name>.packed'.
export function packFile(name: string) {
  console.log("Packing strings in: " + name);

  const contents = fs.readFileSync(name, 'utf8');
  const stats = stringStats(contents);

  console.log(`File length: ${contents.length}`);
  console.log("All lengths:\n" + stats['lengths'].histogramReport());
  console.log("Duplicates:\n" + stats['duplicates'].histogramReport());

  const packed = pack(contents);
  const bytesSaved = contents.length - packed.length;
  const percentSaved = Math.floor(100 * bytesSaved / contents.length);
  console.log(`Packed size: ${packed.length} (saved ${bytesSaved} or ` +
              `${percentSaved}%).`);
  fs.writeFileSync(name + '.packed', packed, 'utf8');
}

// Call main() if run from command line (as opposed to required).
if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (e) {
    console.error(e.message);
    process.exit();
  }
}
