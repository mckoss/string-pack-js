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
