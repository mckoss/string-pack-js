import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
import * as estraverse from 'estraverse';
import { MemberExpression } from 'estree';

import { toName } from './name-generator';
import { Statistic } from './statistic';

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
  let ast = esprima.parse(program, PARSE_OPTIONS);

  estraverse.replace(ast, {
    enter: (node, _) => {
      if (node.type === 'Literal' && typeof(node.value) === 'string') {
        return makeStringMember(iProp++);
      }
    },
  });

  let result = escodegen.generate(ast, GENERATE_OPTIONS);
  return result;
}

export function stringStats(program: string): {[key: string]: Statistic} {
  const ast = esprima.parse(program);
  let lengths = new Statistic();

  estraverse.traverse(ast, {
    enter: (node, _) => {
      if (node.type === 'Literal' && typeof(node.value) === 'string') {
        lengths.sample(node.value.length);
      }
    }
  });

  return { lengths };
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
