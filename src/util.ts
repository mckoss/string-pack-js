import * as zlib from 'zlib';

// Return the size of a string after it has been gzipped.
export function zipSize(content: string): number {
  let result = zlib.deflateSync(content);
  return result.length;
}
