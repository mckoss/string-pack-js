import { assert } from 'chai';
import { dataDrivenTest } from './data-test-helper';

import { Statistic } from '../statistic';

suite("Statistic", () => {
  let tests = [
    { data: [], expect: { count: 0, average: undefined } },
    { data: [100], expect: { count: 1, average: 100 } },
    { data: [1, 2, 3], expect: { count: 3, average: 2 } },
  ];

  dataDrivenTest(tests, (data: number[], expect: any) => {
    let stats = new Statistic();
    data.forEach((x) => stats.sample(x));
    assert.equal(stats.count, expect.count);
    assert.equal(stats.average, expect.average);
  });
});
