import { parse } from 'esprima';
import { generate } from 'escodegen';
import { replace } from 'estraverse';
import { MemberExpression } from 'estree';

import { toName } from './name-generator';

const PARSE_OPTIONS = {
  attachComment: true
};

const GENERATE_OPTIONS = {
  format: {
    compact: true
  },
  comment: true
};

const STRING_TABLE = '_';

// Transpile a JavaScript program by replacing its strings with shared
// references to a shared string table.
export function pack(program: string): string {
  let iProp = 0;
  let ast = parse(program, PARSE_OPTIONS);
  replace(ast, {
    enter: (node, _) => {
      if (node.type === 'Literal' && typeof(node.value) === 'string') {
        return makeStringMember(iProp++);
      }
    },
  });
  let result = generate(ast, GENERATE_OPTIONS);
  return result;
}

export function makeStringMember(i: number): MemberExpression {
  return {
    type: "MemberExpression",
    computed: false,
    object: {
      type: "Identifier",
      name: STRING_TABLE
    },
    property: {
      type: "Identifier",
      name: toName(i)
    }
  };
}
