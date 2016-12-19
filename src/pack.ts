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

const STRING_TABLE_NAME = '_';
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
  mappedStrings: string[] = [];
  // Substract cost of _={...};
  totalSavings = -5;
  tableSize = 0;

  add(s: string) {
    if (s.length < MIN_STRING_SIZE) {
      return;
    }
    if (this.counts[s] === undefined) {
      this.counts[s] = 0;
    }
    this.counts[s] += 1;
  }

  isMapped(s: string): boolean {
    return s in this.mapping;
  }

  // Sort duplicates by descending duplication count
  // and assign strings to successive table indices.
  analyze() {
    let duplicates: string[] = Object.keys(this.counts)
      .filter((s) => this.counts[s] > 1);
    duplicates.sort((a, b) => this.counts[b] - this.counts[a]);

    let i = 0;
    duplicates.forEach((s) => {
      // Ignore strings w/o any byte savings.
      const savings = savedBytes(s.length, this.counts[s], i);
      if (savings <= 0) {
        return;
      }
      this.totalSavings += savings;
      this.tableSize += 1;

      this.mappedStrings.push(s);
      this.mapping[s] = i;
      i += 1;
    });
  }

  toCode(): string {
    let assignments: string[] = [];

    for (let s of this.mappedStrings) {
      assignments.push(toName(this.mapping[s]) + ':' + JSON.stringify(s));
    }

    if (assignments.length === 0) {
      return '';
    }

    return STRING_TABLE_NAME + '={' + assignments.join(',') + '};\n';
  }
}

// Number of bytes saved by changing an inline string to a string-table
// reference (including code of initializing the string table.
//
// Inline: 'xxx'
//
// String table:
//   Define: a:'xxx',   First 54 are one-character names.
//   Inline: _.a
//
// TODO(koss): Can reduce the definition size using some run-time code
// to split() a single delimited string - if there is an unused single-byt
// character in all strings of the string table.
function savedBytes(size: number, count: number, index: number): number {
  const inlineSize = count * (size * 2);
  const symbolSize = 2 + toName(index).length;
  const tableSize = symbolSize + 4 + count * (2 + symbolSize);
  return inlineSize - tableSize;
}

// Transpile a JavaScript program by replacing its strings with shared
// references to a shared string table.
export function pack(program: string): string {
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
  console.log(`Duplicate string savings: ${strings.totalSavings} ` +
              `(${strings.tableSize} entries).`);

  estraverse.replace(ast, {
    enter: (node, _) => {
      // Work around bug in duplicate comment being passed as both leading and
      // trailing in disctinct nodes -> remove any trailing comments.
      if (node.trailingComments) {
        delete node.trailingComments;
      }
      if (node.type === 'Literal' && typeof(node.value) === 'string') {
        if (strings.isMapped(node.value)) {
          return makeStringMember(strings.mapping[node.value]);
        }
      }
    },
  });

  let result = strings.toCode() + escodegen.generate(ast, GENERATE_OPTIONS);
  return result;
}

export function makeStringMember(i: number): MemberExpression {
  return {
    type: "MemberExpression",
    computed: false,
    object: {
      type: "Identifier",
      name: STRING_TABLE_NAME
    },
    property: {
      type: "Identifier",
      name: toName(i)
    }
  };
}
