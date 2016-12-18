#!/usr/bin/env node

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
  console.log(`Total string size: ${stats['lengths'].sum} ` +
              `(from ${stats['lengths'].count} strings).`);

  const packed = pack(contents);
  const bytesSaved = contents.length - packed.length;
  const percentSaved = Math.floor(100 * bytesSaved / contents.length);
  console.log(`Packed size: ${packed.length} (saved ${bytesSaved} or ` +
              `${percentSaved}%).`);
  fs.writeFileSync(name + '.packed', 'utf8');
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
