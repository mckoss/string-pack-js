#!/usr/bin/env node

import * as fs from 'fs';

// Command-line argument processing.
export function main(args: string[]) {
  if (args.length != 1) {
    throw new Error("Usage: string-pack-js <file.js>");
  }
  pack(args[0]);
}

// Pack a single file and write to '<name>.packed'.
export function pack(name:string) {
  console.log("Packing: " + name);

  const binary = fs.readFileSync(name, 'utf8');
  let contents: string;

  contents = fs.readFileSync(name, 'utf8');
  console.log("File length: " + contents.length);
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
