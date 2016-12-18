import { assert } from 'chai';
import { dataDrivenTest } from './data-test-helper';

import { Statistic } from '../statistic';

suite("Statistic", () => {
  let tests = [
    { data: {samples: []},
      expect: { count: 0, average: undefined } },
    { data: {samples: [100], buckets: [0, 20]},
      expect: { count: 1, average: 100, histogram: [0, 0, 0, 0, 0, 1] } },
    { data: {samples: [1, 2, 3], buckets: [1]},
      expect: { count: 3, average: 2, histogram: [1, 1, 1] } },
    { data: {samples: [1, 2, 3, 10, 100, 15, 4], buckets: [1, 10, 100]},
      expect: { histogram: [4, 2, 1] } },
  ];

  dataDrivenTest(tests, (data: any, expect: any) => {
    let stats = new Statistic(data.buckets);
    data.samples.forEach((x: number) => stats.sample(x));
    if (expect.count != undefined) {
      assert.equal(stats.count, expect.count);
    }
    if (expect.average !== undefined) {
      assert.equal(stats.average, expect.average);
    }
    if (expect.histogram !== undefined) {
      assert.deepEqual(stats.histogram, expect.histogram);
    }
  });
});
