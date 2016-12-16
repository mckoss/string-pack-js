import { parse } from 'esprima';
import { generate } from 'escodegen';

const GENERATE_OPTIONS = {
  format: {
    compact: true
  }
};

// Transpile a JavaScript program by replacing its strings with shared
// references to a shared string table.
export function pack(program: string): string {
  let ast = parse(program);
  let result = generate(ast, GENERATE_OPTIONS);
  return result;
}
