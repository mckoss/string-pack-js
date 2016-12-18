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
const MIN_STRING_SIZE = 2;

export function stringStats(program: string): {[key: string]: Statistic} {
  const ast = esprima.parse(program);
  let lengths = new Statistic([0, 1, 2, 3, 4, 5, 10, 20, 50, 100]);
  let duplicates = new Statistic([0, 1, 2, 3, 4, 5, 10, 20, 50, 100]);
  let dups: {[s: string]: boolean} = {};

  estraverse.traverse(ast, {
    enter: (node, _) => {
      if (node.type === 'Literal' && typeof(node.value) === 'string') {
        lengths.sample(node.value.length);
        if (dups[node.value]) {
          duplicates.sample(node.value.length);
        } else {
          dups[node.value] = true;
        }
      }
    }
  });

  return { lengths, duplicates };
}

class StringTable {
  counts: {[s: string]: number} = {};
  mapping: {[s: string]: number} = {};

  add(s: string) {
    if (s.length < MIN_STRING_SIZE) {
      return;
    }
    if (this.counts[s] === undefined) {
      this.counts[s] = 0;
    }
    this.counts[s] += 1;
  }

  analyze() {
    let duplicates: Array<[string, number]> = Object.keys(this.counts)
      .filter((s) => this.counts[s] > 1)
      .map((s) => [s, this.counts[s]]);
    // Descending by count.
    duplicates.sort((a, b) => b[1] - a[1]);

    let i = 0;
    for (let pair of duplicates) {
      this.mapping[pair[0]] = i;
      i += 1;
    }
  }
}

// Transpile a JavaScript program by replacing its strings with shared
// references to a shared string table.
export function pack(program: string): string {
  let iProp = 0;
  let ast = esprima.parse(program, PARSE_OPTIONS);
  let strings = new StringTable();

  estraverse.traverse(ast, {
    enter: (node, _) => {
      if (node.type === 'Literal' && typeof(node.value) === 'string') {
        strings.add(node.value);
      }
    }
  });

  strings.analyze();

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
